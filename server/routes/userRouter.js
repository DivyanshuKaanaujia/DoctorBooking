import express from "express"
import { resgisterUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register",resgisterUser)
// router.post("/login",)

export default router;