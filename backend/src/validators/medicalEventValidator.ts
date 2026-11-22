import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID.");

const sourceEvidenceSchema = z.object({
  documentId: objectIdSchema,
  pageNumber: z.number().int().min(1),
  excerpt: z.string().trim().max(4000).optional(),
  confidence: z.number().min(0).max(1).optional(),
  boundingBox: z.object({
    x: z.number().min(0),
    y: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0)
  }).optional()
});

const commonEventSchema = z.object({
  occurredAt: z.coerce.date(),
  datePrecision: z.enum(["exact", "day", "month", "year"]).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  summary: z.string().trim().max(4000).optional(),
  sourceEvidence: z.array(sourceEvidenceSchema).max(50).optional()
});

const labResultSchema = commonEventSchema.extend({
  kind: z.literal("lab_result"),
  testName: z.string().trim().min(1).max(200),
  testCode: z.string().trim().max(100).optional(),
  codeSystem: z.string().trim().max(100).optional(),
  resultValue: z.object({
    numeric: z.number().finite().optional(),
    text: z.string().trim().min(1).max(500).optional()
  }).refine(
    (value) => (value.numeric !== undefined) !== (value.text !== undefined),
    "Provide exactly one numeric or text result value."
  ),
  unit: z.string().trim().max(100).optional(),
  normalizedValue: z.number().finite().optional(),
  normalizedUnit: z.string().trim().max(100).optional(),
  referenceRange: z.object({
    low: z.number().finite().optional(),
    high: z.number().finite().optional(),
    unit: z.string().trim().max(100).optional(),
    text: z.string().trim().max(300).optional()
  }).refine(
    (range) =>
      range.low === undefined ||
      range.high === undefined ||
      range.low <= range.high,
    "Reference range low must not exceed high."
  ).optional(),
  interpretation: z.enum([
    "normal",
    "low",
    "high",
    "abnormal",
    "critical",
    "unknown"
  ]).optional(),
  specimen: z.string().trim().max(200).optional(),
  resultStatus: z.enum(["preliminary", "final", "corrected", "cancelled"]).optional(),
  panelId: z.string().trim().max(100).optional()
});

const medicationEventSchema = commonEventSchema.extend({
  kind: z.literal("medication"),
  action: z.enum(["started", "dose_changed", "paused", "resumed", "stopped"]),
  medicationName: z.string().trim().min(1).max(200),
  medicationCode: z.string().trim().max(100).optional(),
  codeSystem: z.string().trim().max(100).optional(),
  dose: z.object({
    amount: z.number().finite().positive(),
    unit: z.string().trim().min(1).max(100)
  }).optional(),
  route: z.string().trim().max(100).optional(),
  frequency: z.string().trim().max(200).optional(),
  instructions: z.string().trim().max(1000).optional(),
  courseId: z.string().trim().min(1).max(100).optional(),
  effectiveStart: z.coerce.date().optional(),
  effectiveEnd: z.coerce.date().optional()
}).refine(
  (event) =>
    (event.action !== "started" && event.action !== "dose_changed") ||
    event.dose !== undefined,
  "A dosage amount and unit are required when starting or changing a medication."
).refine(
  (event) =>
    event.effectiveStart === undefined ||
    event.effectiveEnd === undefined ||
    event.effectiveEnd >= event.effectiveStart,
  "Effective end must not precede effective start."
);

const conditionEventSchema = commonEventSchema.extend({
  kind: z.literal("condition"),
  action: z.enum(["diagnosed", "confirmed", "status_changed", "resolved"]),
  conditionName: z.string().trim().min(1).max(200),
  conditionCode: z.string().trim().max(100).optional(),
  codeSystem: z.string().trim().max(100).optional(),
  conditionId: z.string().trim().min(1).max(100).optional(),
  status: z.enum(["active", "remission", "resolved", "ruled_out"]),
  onsetDate: z.coerce.date().optional(),
  resolutionDate: z.coerce.date().optional(),
  severity: z.string().trim().max(100).optional(),
  bodySite: z.string().trim().max(200).optional()
}).refine(
  (event) =>
    event.onsetDate === undefined ||
    event.resolutionDate === undefined ||
    event.resolutionDate >= event.onsetDate,
  "Resolution date must not precede onset date."
);

export const medicalEventSchema = z.discriminatedUnion("kind", [
  labResultSchema,
  medicationEventSchema,
  conditionEventSchema
]);

export const extractionFindingSchema = z.object({
  candidateId: z.string().uuid().optional(),
  confidence: z.number().min(0).max(1),
  event: medicalEventSchema
});

export const createExtractionSchema = z.object({
  documentId: objectIdSchema,
  extractor: z.string().trim().min(1).max(100),
  modelVersion: z.string().trim().max(100).optional()
});

export const updateExtractionSchema = z.object({
  status: z.enum(["processing", "completed", "failed"]),
  modelVersion: z.string().trim().max(100).optional(),
  error: z.string().trim().min(1).max(2000).optional(),
  findings: z.array(extractionFindingSchema).max(500).optional()
}).refine(
  (update) => update.status !== "completed" || update.findings !== undefined,
  "Findings are required when completing an extraction."
).refine(
  (update) => update.status !== "failed" || update.error !== undefined,
  "An error message is required when failing an extraction."
);

export const reviewFindingSchema = z.object({
  decision: z.enum(["accepted", "rejected"])
});

export type MedicalEventInput = z.infer<typeof medicalEventSchema>;
export type ExtractionFindingInput = z.infer<typeof extractionFindingSchema>;
