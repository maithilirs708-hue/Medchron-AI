import { randomUUID } from "crypto";
import { Types } from "mongoose";
import {
  ConditionEvent,
  LabResultEvent,
  MedicationEvent
} from "../models/MedicalEvent";
import { MedicalEventInput } from "../validators/medicalEventValidator";

interface EventOwnership {
  patientId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  origin: "manual" | "ai" | "imported";
  reviewStatus: "pending" | "confirmed" | "rejected";
  confidence?: number;
  extractionId?: Types.ObjectId;
  candidateId?: string;
}

export const createMedicalEvent = async (
  event: MedicalEventInput,
  ownership: EventOwnership
): Promise<Types.ObjectId> => {
  const common = {
    patientId: ownership.patientId,
    userId: ownership.userId,
    occurredAt: event.occurredAt,
    title:
      event.title ??
      (event.kind === "lab_result"
        ? event.testName
        : event.kind === "medication"
          ? `${event.medicationName} ${event.action.replace("_", " ")}`
          : `${event.conditionName} ${event.action.replace("_", " ")}`),
    summary: event.summary,
    sourceEvidence: event.sourceEvidence ?? [],
    origin: ownership.origin,
    reviewStatus: ownership.reviewStatus,
    confidence: ownership.confidence,
    extractionId: ownership.extractionId,
    candidateId: ownership.candidateId
  };

  switch (event.kind) {
    case "lab_result": {
      const created = await LabResultEvent.create({
        ...event,
        ...common
      });
      return created._id;
    }
    case "medication": {
      const created = await MedicationEvent.create({
        ...event,
        ...common,
        courseId: event.courseId ?? randomUUID()
      });
      return created._id;
    }
    case "condition": {
      const created = await ConditionEvent.create({
        ...event,
        ...common,
        conditionId: event.conditionId ?? randomUUID()
      });
      return created._id;
    }
  }
};
