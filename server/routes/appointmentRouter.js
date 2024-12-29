import express from "express"
import { getAppointment, updateAppointmentStatus } from "../controllers/appointmentController.js";
import { authUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/getall",authUser,getAppointment)
router.patch('/update/:appointmentId', updateAppointmentStatus);

export default router