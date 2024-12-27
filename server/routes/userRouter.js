import express from "express"
import { authUser, getDoctors, loginUser, registerUser, verifyUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/verify",authUser,verifyUser)
router.get("/getdoctors",authUser,getDoctors)
// router.post("/login",)

export default router;