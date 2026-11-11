
import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().trim().min(2, "Patient name must contain at least 2 characters."),
  age: z.coerce.number().int().min(0, "Age cannot be negative.").max(120, "Please enter a valid age."),
  gender: z.string().trim().min(1, "Gender is required.")
});

export const updatePatientSchema = z.object({
  name: z.string().trim().min(2, "Patient name must contain at least 2 characters.").optional(),
  age: z.coerce.number().int().min(0, "Age cannot be negative.").max(120, "Please enter a valid age.").optional(),
  gender: z.string().trim().min(1, "Gender is required.").optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  "Please provide at least one field to update."
);
