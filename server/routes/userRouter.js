import express from "express"
import { authUser, loginUser, registerUser, verifyUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/verify",authUser,verifyUser)
// router.post("/login",)

export default router;