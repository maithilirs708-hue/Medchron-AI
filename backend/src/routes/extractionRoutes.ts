import { randomUUID } from "crypto";
import { Router } from "express";
import mongoose from "mongoose";
import Document from "../models/Document";
import DocumentExtraction from "../models/DocumentExtraction";
import Patient from "../models/Patient";
import MedicalEvent from "../models/MedicalEvent";
import { authenticateToken } from "../middleware/authMiddleware";
import { medicalEventSchema } from "../validators/medicalEventValidator";
import { createMedicalEvent } from "../services/medicalEventService";
import { validateRequest } from "../middleware/validateRequest";
import {
  createExtractionSchema,
  ExtractionFindingInput,
  reviewFindingSchema,
  updateExtractionSchema
} from "../validators/medicalEventValidator";

const router = Router();

router.use(authenticateToken);

const getRouteParam = (value: string | string[] | undefined): string =>
  typeof value === "string" ? value : "";

router.post(
  "/patients/:patientId",
  validateRequest(createExtractionSchema),
  async (req, res) => {
    try {
      const patientId = getRouteParam(req.params.patientId);

      if (!mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid patient ID."
        });
      }

      const patient = await Patient.findOne({
        _id: patientId,
        userId: req.user!.userId
      });

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found."
        });
      }

      const document = await Document.findOne({
        _id: req.body.documentId,
        patientId: patient._id,
        userId: req.user!.userId
      });

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found for this patient."
        });
      }

      const extraction = await DocumentExtraction.create({
        patientId: patient._id,
        userId: req.user!.userId,
        documentId: document._id,
        extractor: req.body.extractor,
        modelVersion: req.body.modelVersion,
        status: "queued"
      });

      return res.status(201).json({
        success: true,
        extraction
      });
    } catch (error) {
      console.error("Create extraction error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create document extraction."
      });
    }
  }
);

router.get("/patients/:patientId", async (req, res) => {
  try {
    const patientId = getRouteParam(req.params.patientId);

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID."
      });
    }

    const patient = await Patient.findOne({
      _id: patientId,
      userId: req.user!.userId
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found."
      });
    }

    const extractions = await DocumentExtraction.find({
      patientId: patient._id,
      userId: req.user!.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      extractions
    });
  } catch (error) {
    console.error("Get patient extractions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve document extractions."
    });
  }
});

router.get("/:extractionId", async (req, res) => {
  try {
    const extractionId = getRouteParam(req.params.extractionId);

    if (!mongoose.isValidObjectId(extractionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid extraction ID."
      });
    }

    const extraction = await DocumentExtraction.findOne({
      _id: extractionId,
      userId: req.user!.userId
    });

    if (!extraction) {
      return res.status(404).json({
        success: false,
        message: "Document extraction not found."
      });
    }

    return res.status(200).json({
      success: true,
      extraction
    });
  } catch (error) {
    console.error("Get extraction error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve document extraction."
    });
  }
});

router.patch(
  "/:extractionId",
  validateRequest(updateExtractionSchema),
  async (req, res) => {
    try {
      const extractionId = getRouteParam(req.params.extractionId);

      if (!mongoose.isValidObjectId(extractionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid extraction ID."
        });
      }

      const extraction = await DocumentExtraction.findOne({
        _id: extractionId,
        userId: req.user!.userId
      });

      if (!extraction) {
        return res.status(404).json({
          success: false,
          message: "Document extraction not found."
        });
      }

      const allowedTransitions: Record<string, string[]> = {
        queued: ["processing", "failed"],
        processing: ["completed", "failed"]
      };

      if (!allowedTransitions[extraction.status]?.includes(req.body.status)) {
        return res.status(409).json({
          success: false,
          message: "Extraction status cannot be changed in this way."
        });
      }

      const extractionFindings =
        req.body.findings as ExtractionFindingInput[] | undefined;
      const findings = extractionFindings?.map((finding) => ({
          candidateId: finding.candidateId ?? randomUUID(),
          confidence: finding.confidence,
          eventData: finding.event,
          status: "pending" as const
        }));

      if (findings) {
        const candidateIds = findings.map((finding) => finding.candidateId);
        if (new Set(candidateIds).size !== candidateIds.length) {
          return res.status(400).json({
            success: false,
            message: "Finding candidate IDs must be unique."
          });
        }
      }

      const update: {
        status: string;
        modelVersion?: string;
        error?: string;
        findings?: typeof findings;
        startedAt?: Date;
        completedAt?: Date;
      } = {
        status: req.body.status
      };

      if (req.body.modelVersion !== undefined) {
        update.modelVersion = req.body.modelVersion;
      }
      if (req.body.error !== undefined) {
        update.error = req.body.error;
      }
      if (findings !== undefined) {
        update.findings = findings;
      }
      if (req.body.status === "processing") {
        update.startedAt = new Date();
      }
      if (req.body.status === "completed" || req.body.status === "failed") {
        update.completedAt = new Date();
      }

      const updatedExtraction = await DocumentExtraction.findOneAndUpdate(
        {
          _id: extraction._id,
          userId: req.user!.userId,
          status: extraction.status
        },
        { $set: update },
        { new: true, runValidators: true }
      );

      if (!updatedExtraction) {
        return res.status(409).json({
          success: false,
          message: "Extraction was updated by another request. Reload and retry."
        });
      }

      return res.status(200).json({
        success: true,
        extraction: updatedExtraction
      });
    } catch (error) {
      console.error("Update extraction error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update document extraction."
      });
    }
  }
);

router.post(
  "/:extractionId/findings/:candidateId/review",
  validateRequest(reviewFindingSchema),
  async (req, res) => {
    try {
      const extractionId = getRouteParam(req.params.extractionId);
      const candidateId = getRouteParam(req.params.candidateId);

      if (!mongoose.isValidObjectId(extractionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid extraction ID."
        });
      }

      const extraction = await DocumentExtraction.findOne({
        _id: extractionId,
        userId: req.user!.userId
      });

      if (!extraction) {
        return res.status(404).json({
          success: false,
          message: "Document extraction not found."
        });
      }

      if (extraction.status !== "completed") {
        return res.status(409).json({
          success: false,
          message: "Only completed extractions can be reviewed."
        });
      }

      const finding = extraction.findings.find(
        (item) => item.candidateId === candidateId
      );

      if (!finding) {
        return res.status(404).json({
          success: false,
          message: "Extraction finding not found."
        });
      }

      if (req.body.decision === "rejected") {
        const updated = await DocumentExtraction.findOneAndUpdate(
          {
            _id: extraction._id,
            userId: req.user!.userId,
            status: "completed",
            findings: {
              $elemMatch: { candidateId, status: "pending" }
            }
          },
          { $set: { "findings.$.status": "rejected" } },
          { new: true }
        );

        if (!updated && finding.status !== "rejected") {
          return res.status(409).json({
            success: false,
            message: "This finding has already been reviewed."
          });
        }

        return res.status(200).json({
          success: true,
          extraction: updated ?? extraction
        });
      }

      if (finding.status === "rejected") {
        return res.status(409).json({
          success: false,
          message: "A rejected finding cannot be accepted."
        });
      }

      const parsedEvent = medicalEventSchema.safeParse(finding.eventData);
      if (!parsedEvent.success) {
        return res.status(422).json({
          success: false,
          message: "Stored extraction finding is invalid.",
          errors: parsedEvent.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }

      const evidence = parsedEvent.data.sourceEvidence ?? [];
      if (
        evidence.length === 0 ||
        evidence.some(
          (item) =>
            item.documentId.toLowerCase() !== extraction.documentId.toString()
        )
      ) {
        return res.status(422).json({
          success: false,
          message: "AI findings must include page evidence from their source document."
        });
      }

      if (finding.status === "pending") {
        await DocumentExtraction.findOneAndUpdate(
          {
            _id: extraction._id,
            userId: req.user!.userId,
            status: "completed",
            findings: {
              $elemMatch: { candidateId, status: "pending" }
            }
          },
          { $set: { "findings.$.status": "accepting" } }
        );
      }

      const currentExtraction = await DocumentExtraction.findOne({
        _id: extraction._id,
        userId: req.user!.userId
      });
      const currentFinding = currentExtraction?.findings.find(
        (item) => item.candidateId === candidateId
      );

      if (currentFinding?.status === "rejected") {
        return res.status(409).json({
          success: false,
          message: "A rejected finding cannot be accepted."
        });
      }

      let event = await MedicalEvent.findOne({
        extractionId: extraction._id,
        candidateId,
        userId: req.user!.userId
      });

      if (!event) {
        const eventId = await createMedicalEvent(parsedEvent.data, {
          patientId: extraction.patientId,
          userId: req.user!.userId,
          origin: "ai",
          reviewStatus: "confirmed",
          confidence: finding.confidence,
          extractionId: extraction._id,
          candidateId
        });
        event = await MedicalEvent.findById(eventId);
      }

      if (!event) {
        throw new Error("Accepted extraction event could not be retrieved.");
      }

      await DocumentExtraction.updateOne(
        {
          _id: extraction._id,
          userId: req.user!.userId,
          findings: {
            $elemMatch: {
              candidateId,
              status: { $in: ["pending", "accepting", "accepted"] }
            }
          }
        },
        {
          $set: {
            "findings.$.status": "accepted",
            "findings.$.medicalEventId": event._id
          }
        }
      );

      return res.status(200).json({
        success: true,
        event
      });
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 11000
      ) {
        return res.status(409).json({
          success: false,
          message: "This extraction finding has already been accepted."
        });
      }

      console.error("Review extraction finding error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to review extraction finding."
      });
    }
  }
);

export default router;
