import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { authenticateToken } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import Document from "../models/Document";
import MedicalEvent from "../models/MedicalEvent";
import Patient from "../models/Patient";
import { createMedicalEvent } from "../services/medicalEventService";
import {
  medicalEventSchema,
} from "../validators/medicalEventValidator";

const router = Router();

router.use(authenticateToken);

const timelineQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  kind: z.enum(["lab_result", "medication", "condition"]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  testCode: z.string().trim().min(1).max(100).optional(),
  courseId: z.string().trim().min(1).max(100).optional(),
  conditionId: z.string().trim().min(1).max(100).optional()
}).refine(
  (query) => query.from === undefined || query.to === undefined || query.from <= query.to,
  "The from date must not be after the to date."
).refine(
  (query) => query.testCode === undefined || query.kind === "lab_result",
  "testCode can only be used with kind=lab_result."
).refine(
  (query) => query.courseId === undefined || query.kind === "medication",
  "courseId can only be used with kind=medication."
).refine(
  (query) => query.conditionId === undefined || query.kind === "condition",
  "conditionId can only be used with kind=condition."
);

const getPatientForUser = async (patientId: string, userId: string) => {
  if (!mongoose.isValidObjectId(patientId)) {
    return { kind: "invalid_patient_id" as const };
  }

  const patient = await Patient.findOne({
    _id: patientId,
    userId
  });

  return patient
    ? { kind: "ok" as const, patient }
    : { kind: "patient_not_found" as const };
};

const getTimeline = async (
  patientId: string,
  userId: string,
  queryInput: unknown
): Promise<
  | { kind: "invalid_query"; details: { field: string; message: string }[] }
  | { kind: "invalid_patient_id" }
  | { kind: "patient_not_found" }
  | {
      kind: "ok";
      timeline: Awaited<ReturnType<typeof MedicalEvent.find>>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }
> => {
  const parsedQuery = timelineQuerySchema.safeParse(queryInput);
  if (!parsedQuery.success) {
    return {
      kind: "invalid_query",
      details: parsedQuery.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    };
  }

  const patientResult = await getPatientForUser(patientId, userId);
  if (patientResult.kind !== "ok") {
    return patientResult;
  }

  const options = parsedQuery.data;
  const skip = (options.page - 1) * options.limit;
  const eventsQuery = MedicalEvent.find({
    patientId: patientResult.patient._id,
    userId
  });
  const countQuery = MedicalEvent.countDocuments({
    patientId: patientResult.patient._id,
    userId
  });

  if (options.kind) {
    eventsQuery.where("kind").equals(options.kind);
    countQuery.where("kind").equals(options.kind);
  }
  if (options.from) {
    eventsQuery.where("occurredAt", { $gte: options.from });
    countQuery.where("occurredAt", { $gte: options.from });
  }
  if (options.to) {
    eventsQuery.where("occurredAt", { $lte: options.to });
    countQuery.where("occurredAt", { $lte: options.to });
  }

  if (options.testCode) {
    eventsQuery.where("testCode").equals(options.testCode);
    countQuery.where("testCode").equals(options.testCode);
  }
  if (options.courseId) {
    eventsQuery.where("courseId").equals(options.courseId);
    countQuery.where("courseId").equals(options.courseId);
  }
  if (options.conditionId) {
    eventsQuery.where("conditionId").equals(options.conditionId);
    countQuery.where("conditionId").equals(options.conditionId);
  }

  const [timeline, total] = await Promise.all([
    eventsQuery
      .sort({ occurredAt: -1, _id: -1 })
      .skip(skip)
      .limit(options.limit),
    countQuery
  ]);

  return {
    kind: "ok",
    timeline,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit)
    }
  };
};

router.get("/:patientId", async (req, res) => {
  try {
    const patientId =
      typeof req.params.patientId === "string" ? req.params.patientId : "";
    const result = await getTimeline(
      patientId,
      req.user!.userId,
      req.query
    );

    if (result.kind === "invalid_patient_id") {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID."
      });
    }
    if (result.kind === "patient_not_found") {
      return res.status(404).json({
        success: false,
        message: "Patient not found."
      });
    }
    if (result.kind === "invalid_query") {
      return res.status(400).json({
        success: false,
        message: "Invalid timeline query.",
        errors: result.details
      });
    }

    return res.status(200).json({
      success: true,
      message: "Timeline retrieved successfully.",
      patientId,
      timeline: result.timeline,
      pagination: result.pagination
    });
  } catch (error) {
    console.error("Timeline error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve medical timeline."
    });
  }
});

router.post(
  "/:patientId/events",
  validateRequest(medicalEventSchema),
  async (req, res) => {
    try {
      const patientId =
        typeof req.params.patientId === "string" ? req.params.patientId : "";
      const patientResult = await getPatientForUser(patientId, req.user!.userId);

      if (patientResult.kind !== "ok") {
        return res.status(patientResult.kind === "invalid_patient_id" ? 400 : 404).json({
          success: false,
          message:
            patientResult.kind === "invalid_patient_id"
              ? "Invalid patient ID."
              : "Patient not found."
        });
      }

      const eventInput = medicalEventSchema.parse(req.body);
      const evidenceDocumentIds = [
        ...new Set(
          (eventInput.sourceEvidence ?? []).map((evidence) => evidence.documentId)
        )
      ];

      if (evidenceDocumentIds.length > 0) {
        const ownedEvidenceCount = await Document.countDocuments({
          _id: { $in: evidenceDocumentIds },
          patientId: patientResult.patient._id,
          userId: req.user!.userId
        });

        if (ownedEvidenceCount !== evidenceDocumentIds.length) {
          return res.status(400).json({
            success: false,
            message: "Evidence documents must belong to this patient."
          });
        }
      }

      const eventId = await createMedicalEvent(eventInput, {
        patientId: patientResult.patient._id,
        userId: req.user!.userId,
        origin: "manual",
        reviewStatus: "confirmed"
      });
      const event = await MedicalEvent.findOne({
        _id: eventId,
        patientId: patientResult.patient._id,
        userId: req.user!.userId
      });

      return res.status(201).json({
        success: true,
        event
      });
    } catch (error) {
      console.error("Create medical event error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create medical event."
      });
    }
  }
);

export default router;
