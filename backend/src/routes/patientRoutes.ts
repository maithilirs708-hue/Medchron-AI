import { validateRequest } from "../middleware/validateRequest";
import {
  createPatientSchema,
  updatePatientSchema
} from "../validators/patientValidator";
import { Router } from "express";
import mongoose from "mongoose";
import Patient from "../models/Patient";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Protect all patient routes
router.use(authenticateToken);

// GET ALL PATIENTS CREATED BY LOGGED-IN USER
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find({
      userId: req.user!.userId
    }).sort({ createdAt: -1 });

    return res.status(200).json(patients);
  } catch (error) {
    console.error("Get patients error:", error);
    return res.status(500).json({
      message: "Failed to retrieve patients."
    });
  }
});

// GET ONE PATIENT
router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({
        message: "Invalid patient ID."
      });
    }

    const patient = await Patient.findOne({
      _id: patientId,
      userId: req.user!.userId
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found."
      });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error("Get patient error:", error);
    return res.status(500).json({
      message: "Failed to retrieve patient."
    });
  }
});

// CREATE PATIENT
router.post("/", validateRequest(createPatientSchema), async (req, res) => {
  try {
    const { name, age, gender } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof age !== "number" ||
      !Number.isFinite(age) ||
      age < 0 ||
      !Number.isInteger(age) ||
      typeof gender !== "string" ||
      !gender.trim()
    ) {
      return res.status(400).json({
        message: "Valid name, age, and gender are required."
      });
    }

    const patient = await Patient.create({
      name: name.trim(),
      age,
      gender: gender.trim(),
      userId: req.user!.userId
    });

    return res.status(201).json(patient);
  } catch (error) {
    console.error("Create patient error:", error);
    return res.status(500).json({
      message: "Failed to create patient."
    });
  }
});


 // UPDATE PATIENT
router.put("/:patientId", validateRequest(updatePatientSchema), async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({
        message: "Invalid patient ID."
      });
    }

    const updates: {
      name?: string;
      age?: number;
      gender?: string;
    } = {};

    if (req.body.name !== undefined) {
      updates.name = req.body.name.trim();
    }

    if (req.body.age !== undefined) {
      updates.age = req.body.age;
    }

    if (req.body.gender !== undefined) {
      updates.gender = req.body.gender.trim();
    }

    const patient = await Patient.findOneAndUpdate(
      {
        _id: patientId,
        userId: req.user!.userId
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully.",
      patient
    });
  } catch (error) {
    console.error("Update patient error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update patient."
    });
  }
});


// DELETE PATIENT
router.delete("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!mongoose.isValidObjectId(patientId)) {
      return res.status(400).json({
        message: "Invalid patient ID."
      });
    }

    const patient = await Patient.findOneAndDelete({
      _id: patientId,
      userId: req.user!.userId
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found."
      });
    }

    return res.status(200).json({
      message: "Patient deleted successfully."
    });
  } catch (error) {
    console.error("Delete patient error:", error);
    return res.status(500).json({
      message: "Failed to delete patient."
    });
  }
});


export default router;
