import mongoose, { Document, Schema, Types } from "mongoose";

export type ExtractionStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface IExtractionFinding extends Document {
  candidateId: string;
  eventData: unknown;
  confidence: number;
  status: "pending" | "accepting" | "accepted" | "rejected";
  medicalEventId?: Types.ObjectId;
}

export interface IDocumentExtraction extends Document {
  patientId: Types.ObjectId;
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  status: ExtractionStatus;
  extractor: string;
  modelVersion?: string;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  findings: Types.DocumentArray<IExtractionFinding>;
}

const extractionFindingSchema = new Schema<IExtractionFinding>(
  {
    candidateId: { type: String, required: true, trim: true },
    eventData: { type: Schema.Types.Mixed, required: true },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    status: {
      type: String,
      enum: ["pending", "accepting", "accepted", "rejected"],
      required: true,
      default: "pending"
    },
    medicalEventId: {
      type: Schema.Types.ObjectId,
      ref: "MedicalEvent"
    }
  },
  { _id: false }
);

const documentExtractionSchema = new Schema<IDocumentExtraction>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "MedicalDocument",
      required: true
    },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      required: true,
      default: "queued"
    },
    extractor: { type: String, required: true, trim: true, maxlength: 100 },
    modelVersion: { type: String, trim: true, maxlength: 100 },
    startedAt: { type: Date },
    completedAt: { type: Date },
    error: { type: String, trim: true, maxlength: 2000 },
    findings: { type: [extractionFindingSchema], default: [] }
  },
  { timestamps: true }
);

documentExtractionSchema.index({ patientId: 1, createdAt: -1 });
documentExtractionSchema.index({ documentId: 1, createdAt: -1 });
documentExtractionSchema.index({ userId: 1, status: 1, createdAt: -1 });

export default mongoose.model<IDocumentExtraction>(
  "DocumentExtraction",
  documentExtractionSchema
);
