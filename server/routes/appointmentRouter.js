import express from "express"
import { getAppointment } from "../controllers/appointmentController.js";
import { authUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/getall",authUser,getAppointment)

export default router