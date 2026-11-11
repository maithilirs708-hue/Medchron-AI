
import { z } from "zod";

export const documentUploadSchema = z.object({
  patientId: z.string().regex(
    /^[0-9a-fA-F]{24}$/,
    "Please provide a valid patient ID."
  )
});
