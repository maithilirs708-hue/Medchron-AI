
import mongoose, { Schema, Document } from "mongoose";

export interface IMedicalDocument extends Document {
  patientId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  originalName: string;
  mimeType: string;
  size: number;
  cloudinaryPublicId: string;
  resourceType: string;
  uploadedAt: Date;
}

const documentSchema = new Schema<IMedicalDocument>(
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
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    cloudinaryPublicId: {
      type: String,
      required: true
    },
    resourceType: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model<IMedicalDocument>(
  "MedicalDocument",
  documentSchema
);
