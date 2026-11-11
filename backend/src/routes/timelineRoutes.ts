
import { Router } from "express";
import mongoose from "mongoose";
import Patient from "../models/Patient";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Only logged-in users can access the timeline
router.use(authenticateToken);

// GET MEDICAL TIMELINE FOR A PATIENT
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID."
      });
    }

    // Check whether the patient belongs to the logged-in user
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

    // Actual timeline events will be connected later
    return res.status(200).json({
      success: true,
      message: "Timeline API is working.",
      patientId,
      timeline: []
    });

  } catch (error) {
    console.error("Timeline error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve medical timeline."
    });
  }
});

export default router;
