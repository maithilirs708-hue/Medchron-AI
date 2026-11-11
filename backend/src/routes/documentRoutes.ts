import { validateRequest } from "../middleware/validateRequest";
import { documentUploadSchema } from "../validators/documentValidator";
import rateLimit from "express-rate-limit";
import FileType from "file-type";
import { Router } from "express";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { Readable } from "stream";

import Document from "../models/Document";
import Patient from "../models/Patient";
import cloudinary from "../config/cloudinary";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    message: "Too many upload requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false
});
// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
  fileSize: 10 * 1024 * 1024,
  files: 1,
  fields: 1,
  parts: 2,
  fieldSize: 10 * 1024
},
  fileFilter: (_req, file, callback) => {
    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];

    const allowedMimeTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (
      allowedExtensions.includes(extension) &&
      allowedMimeTypes.includes(file.mimetype)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Only PDF, PNG, and JPG files are allowed."));
    }
  }
});

// UPLOAD DOCUMENT TO CLOUDINARY

router.post("/upload", uploadLimiter, (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      switch (error.code) {
        case "LIMIT_FILE_SIZE":
          return res.status(413).json({
            success: false,
            message: "File size must not exceed 10 MB."
          });

        case "LIMIT_FILE_COUNT":
        case "LIMIT_UNEXPECTED_FILE":
          return res.status(400).json({
            success: false,
            message: "Please upload only one file using the field name 'file'."
          });

        case "LIMIT_FIELD_COUNT":
        case "LIMIT_PART_COUNT":
        case "LIMIT_FIELD_VALUE":
          return res.status(400).json({
            success: false,
            message: "Invalid upload request. Check the file and patient ID fields."
          });

        default:
          return res.status(400).json({
            success: false,
            message: "Invalid file upload request."
          });
      }
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid file upload."
      });
    }

    next();
  });
}, validateRequest(documentUploadSchema), async (req, res) => {

  let uploadedPublicId: string | null = null;
    let uploadedResourceType: string | null = null;
  try {
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a medical document."
      });
    }
    // Verify actual file contents
const detectedType = await FileType.fromBuffer(req.file.buffer);

const allowedTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg"
];

if (
  !detectedType ||
  !allowedTypes.includes(detectedType.mime) ||
  detectedType.mime !== req.file.mimetype
) {
  return res.status(400).json({
    success: false,
    message: "Invalid file content. Upload a genuine PDF, PNG, or JPG file."
  });
}

    const { patientId } = req.body;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "A valid patient ID is required."
      });
    }

    // Verify patient ownership
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

    // Upload actual file to Cloudinary
    const uploadResult = await new Promise<{
      public_id: string;
      resource_type: string;
    }>((resolve, reject) => {

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "medchron-ai",
          resource_type: "auto",
          type: "authenticated",
          unique_filename: true
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary returned no upload result."));
            return;
          }

          resolve({
            public_id: result.public_id,
            resource_type: result.resource_type
          });
        }
      );
          

      Readable.from([req.file!.buffer]).pipe(uploadStream);
    });
     uploadedPublicId = uploadResult.public_id;
     uploadedResourceType = uploadResult.resource_type;

    // Save file details in MongoDB
    const document = await Document.create({
      patientId: patient._id,
      userId: req.user!.userId,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      cloudinaryPublicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type
    });

   return res.status(201).json({
  success: true,
  message: "Medical document uploaded successfully.",
  document: {
    id: document._id,
    patientId: document.patientId,
    originalName: document.originalName,
    mimeType: document.mimeType,
    size: document.size,
    uploadedAt: document.uploadedAt
  }
});

  
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Delete uploaded file if MongoDB saving fails
    if (uploadedPublicId && uploadedResourceType) {
      try {
        await cloudinary.uploader.destroy(uploadedPublicId, {
          resource_type: uploadedResourceType,
          type: "authenticated",
          invalidate: true
        });
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed:", cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload medical document."
    });
  }

});

// GET SECURE ACCESS URL FOR ONE DOCUMENT
router.get("/:documentId/access", async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.isValidObjectId(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID."
      });
    }

    // Verify document belongs to logged-in user
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!.userId
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found."
      });
    }

    // Generate a temporary signed URL
    const fileFormat = path.extname(document.originalName).slice(1).toLowerCase();

    const accessUrl = cloudinary.utils.private_download_url(
      document.cloudinaryPublicId,
      fileFormat,
      {
        resource_type: document.resourceType,
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 300,
        attachment: false
      }
    );

    return res.status(200).json({
      success: true,
      message: "Temporary document access URL generated.",
      accessUrl,
      expiresIn: 300
    });

  } catch (error) {
    console.error("Document access error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to access this document."
    });
  }
});

 // DELETE A MEDICAL DOCUMENT
router.delete("/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.isValidObjectId(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID."
      });
    }

    // Find document belonging to logged-in user
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!.userId
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found."
      });
    }

    // Delete file from Cloudinary
    const result = await cloudinary.uploader.destroy(
      document.cloudinaryPublicId,
      {
        resource_type: document.resourceType,
        type: "authenticated",
        invalidate: true
      }
    );

    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(500).json({
        success: false,
        message: "Unable to delete the file from cloud storage."
      });
    }

    // Delete document metadata from MongoDB
    await Document.deleteOne({
      _id: documentId,
      userId: req.user!.userId
    });

    return res.status(200).json({
      success: true,
      message: "Medical document deleted successfully."
    });

  } catch (error) {
    console.error("Delete document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete medical document."
    });
  }
});


 // GET DETAILS OF ONE DOCUMENT
router.get("/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.isValidObjectId(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID."
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!.userId
    }).select("-cloudinaryPublicId -userId");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found."
      });
    }

    return res.status(200).json({
      success: true,
      document
    });

  } catch (error) {
    console.error("Get document details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve document details."
    });
  }
});



// GET ALL DOCUMENTS OF LOGGED-IN USER
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      Document.find({
        userId: req.user!.userId
      })
        .select("-cloudinaryPublicId -userId")
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit),

      Document.countDocuments({
        userId: req.user!.userId
      })
    ]);

    return res.status(200).json({
      success: true,
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get documents error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve documents."
    });
  }
});


// GET DOCUMENTS FOR ONE PATIENT
router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

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

    const documents = await Document.find({
  patientId,
  userId: req.user!.userId
})
  .select("-cloudinaryPublicId -userId")
  .sort({ uploadedAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents
    });

  } catch (error) {
    console.error("Get patient documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve patient documents."
    });
  }
});

export default router;
