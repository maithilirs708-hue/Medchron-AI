import mongoose, { Document, Schema, Types } from "mongoose";

export type MedicalEventKind = "lab_result" | "medication" | "condition";
export type ClinicalOrigin = "manual" | "ai" | "imported";
export type ReviewStatus = "pending" | "confirmed" | "rejected";

export interface ISourceEvidence {
  documentId: Types.ObjectId;
  pageNumber: number;
  excerpt?: string;
  confidence?: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface IMedicalEvent extends Document {
  patientId: Types.ObjectId;
  userId: Types.ObjectId;
  kind: MedicalEventKind;
  occurredAt: Date;
  datePrecision: "exact" | "day" | "month" | "year";
  title: string;
  summary?: string;
  origin: ClinicalOrigin;
  reviewStatus: ReviewStatus;
  confidence?: number;
  sourceEvidence: ISourceEvidence[];
  extractionId?: Types.ObjectId;
  candidateId?: string;
}

export interface ILabResultEvent extends IMedicalEvent {
  testName: string;
  testCode?: string;
  codeSystem?: string;
  resultValue: {
    numeric?: number;
    text?: string;
  };
  unit?: string;
  normalizedValue?: number;
  normalizedUnit?: string;
  referenceRange?: {
    low?: number;
    high?: number;
    unit?: string;
    text?: string;
  };
  interpretation?: "normal" | "low" | "high" | "abnormal" | "critical" | "unknown";
  specimen?: string;
  resultStatus?: "preliminary" | "final" | "corrected" | "cancelled";
  panelId?: string;
}

export interface IMedicationEvent extends IMedicalEvent {
  action: "started" | "dose_changed" | "paused" | "resumed" | "stopped";
  medicationName: string;
  medicationCode?: string;
  codeSystem?: string;
  dose?: {
    amount: number;
    unit: string;
  };
  route?: string;
  frequency?: string;
  instructions?: string;
  courseId: string;
  effectiveStart?: Date;
  effectiveEnd?: Date;
}

export interface IConditionEvent extends IMedicalEvent {
  action: "diagnosed" | "confirmed" | "status_changed" | "resolved";
  conditionName: string;
  conditionCode?: string;
  codeSystem?: string;
  conditionId: string;
  status: "active" | "remission" | "resolved" | "ruled_out";
  onsetDate?: Date;
  resolutionDate?: Date;
  severity?: string;
  bodySite?: string;
}

const boundingBoxSchema = new Schema(
  {
    x: { type: Number, required: true, min: 0 },
    y: { type: Number, required: true, min: 0 },
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

export const sourceEvidenceSchema = new Schema<ISourceEvidence>(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "MedicalDocument",
      required: true
    },
    pageNumber: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger
    },
    excerpt: { type: String, trim: true, maxlength: 4000 },
    confidence: { type: Number, min: 0, max: 1 },
    boundingBox: { type: boundingBoxSchema }
  },
  { _id: false }
);

const medicalEventSchema = new Schema<IMedicalEvent>(
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
    kind: {
      type: String,
      enum: ["lab_result", "medication", "condition"],
      required: true
    },
    occurredAt: { type: Date, required: true },
    datePrecision: {
      type: String,
      enum: ["exact", "day", "month", "year"],
      default: "exact"
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    summary: { type: String, trim: true, maxlength: 4000 },
    origin: {
      type: String,
      enum: ["manual", "ai", "imported"],
      required: true
    },
    reviewStatus: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      required: true,
      default: "pending"
    },
    confidence: { type: Number, min: 0, max: 1 },
    sourceEvidence: { type: [sourceEvidenceSchema], default: [] },
    extractionId: {
      type: Schema.Types.ObjectId,
      ref: "DocumentExtraction"
    },
    candidateId: { type: String, trim: true }
  },
  {
    timestamps: true,
    discriminatorKey: "kind"
  }
);

medicalEventSchema.index({ patientId: 1, occurredAt: -1, _id: -1 });
medicalEventSchema.index({ patientId: 1, kind: 1, occurredAt: -1 });
medicalEventSchema.index(
  { extractionId: 1, candidateId: 1 },
  { unique: true, sparse: true }
);

const MedicalEvent = mongoose.model<IMedicalEvent>(
  "MedicalEvent",
  medicalEventSchema
);

const labResultSchema = new Schema<ILabResultEvent>(
  {
    testName: { type: String, required: true, trim: true, maxlength: 200 },
    testCode: { type: String, trim: true, maxlength: 100 },
    codeSystem: { type: String, trim: true, maxlength: 100 },
    resultValue: {
      numeric: { type: Number },
      text: { type: String, trim: true, maxlength: 500 }
    },
    unit: { type: String, trim: true, maxlength: 100 },
    normalizedValue: { type: Number },
    normalizedUnit: { type: String, trim: true, maxlength: 100 },
    referenceRange: {
      low: { type: Number },
      high: { type: Number },
      unit: { type: String, trim: true, maxlength: 100 },
      text: { type: String, trim: true, maxlength: 300 }
    },
    interpretation: {
      type: String,
      enum: ["normal", "low", "high", "abnormal", "critical", "unknown"]
    },
    specimen: { type: String, trim: true, maxlength: 200 },
    resultStatus: {
      type: String,
      enum: ["preliminary", "final", "corrected", "cancelled"]
    },
    panelId: { type: String, trim: true, maxlength: 100 }
  },
  { _id: false }
);

labResultSchema.pre("validate", function () {
  const hasNumeric = this.resultValue?.numeric !== undefined;
  const hasText = Boolean(this.resultValue?.text?.trim());

  if (hasNumeric === hasText) {
    this.invalidate(
      "resultValue",
      "Provide exactly one numeric or text result value."
    );
  }

  if (
    this.referenceRange?.low !== undefined &&
    this.referenceRange.high !== undefined &&
    this.referenceRange.low > this.referenceRange.high
  ) {
    this.invalidate("referenceRange", "Reference range low must not exceed high.");
  }

  if (
    this.normalizedValue !== undefined &&
    !this.normalizedUnit?.trim()
  ) {
    this.invalidate(
      "normalizedUnit",
      "A normalized unit is required with a normalized result value."
    );
  }
});

labResultSchema.index({ patientId: 1, testCode: 1, occurredAt: -1 });

const medicationEventSchema = new Schema<IMedicationEvent>(
  {
    action: {
      type: String,
      enum: ["started", "dose_changed", "paused", "resumed", "stopped"],
      required: true
    },
    medicationName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    medicationCode: { type: String, trim: true, maxlength: 100 },
    codeSystem: { type: String, trim: true, maxlength: 100 },
    dose: {
      amount: { type: Number, min: 0.000001 },
      unit: { type: String, trim: true, maxlength: 100 }
    },
    route: { type: String, trim: true, maxlength: 100 },
    frequency: { type: String, trim: true, maxlength: 200 },
    instructions: { type: String, trim: true, maxlength: 1000 },
    courseId: { type: String, required: true, trim: true, maxlength: 100 },
    effectiveStart: { type: Date },
    effectiveEnd: { type: Date }
  },
  { _id: false }
);

medicationEventSchema.pre("validate", function () {
  const hasPartialDose =
    this.dose?.amount !== undefined || Boolean(this.dose?.unit?.trim());

  if (
    hasPartialDose &&
    (this.dose?.amount === undefined || !this.dose.unit?.trim())
  ) {
    this.invalidate("dose", "A dosage amount and unit must be provided together.");
  }

  if (
    (this.action === "started" || this.action === "dose_changed") &&
    (!this.dose || this.dose.amount === undefined || !this.dose.unit?.trim())
  ) {
    this.invalidate("dose", "A dosage amount and unit are required for this action.");
  }

  if (
    this.effectiveStart &&
    this.effectiveEnd &&
    this.effectiveEnd < this.effectiveStart
  ) {
    this.invalidate("effectiveEnd", "Effective end must not precede effective start.");
  }
});

medicationEventSchema.index({ patientId: 1, courseId: 1, occurredAt: -1 });

const conditionEventSchema = new Schema<IConditionEvent>(
  {
    action: {
      type: String,
      enum: ["diagnosed", "confirmed", "status_changed", "resolved"],
      required: true
    },
    conditionName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    conditionCode: { type: String, trim: true, maxlength: 100 },
    codeSystem: { type: String, trim: true, maxlength: 100 },
    conditionId: { type: String, required: true, trim: true, maxlength: 100 },
    status: {
      type: String,
      enum: ["active", "remission", "resolved", "ruled_out"],
      required: true
    },
    onsetDate: { type: Date },
    resolutionDate: { type: Date },
    severity: { type: String, trim: true, maxlength: 100 },
    bodySite: { type: String, trim: true, maxlength: 200 }
  },
  { _id: false }
);

conditionEventSchema.pre("validate", function () {
  if (this.action === "resolved" && this.status !== "resolved") {
    this.invalidate("status", "A resolved condition event must have resolved status.");
  }

  if (
    this.onsetDate &&
    this.resolutionDate &&
    this.resolutionDate < this.onsetDate
  ) {
    this.invalidate("resolutionDate", "Resolution date must not precede onset date.");
  }
});

conditionEventSchema.index({ patientId: 1, conditionId: 1, occurredAt: -1 });

export const LabResultEvent = MedicalEvent.discriminator<ILabResultEvent>(
  "LabResultEvent",
  labResultSchema,
  { value: "lab_result" }
);

export const MedicationEvent = MedicalEvent.discriminator<IMedicationEvent>(
  "MedicationEvent",
  medicationEventSchema,
  { value: "medication" }
);

export const ConditionEvent = MedicalEvent.discriminator<IConditionEvent>(
  "ConditionEvent",
  conditionEventSchema,
  { value: "condition" }
);

export default MedicalEvent;
