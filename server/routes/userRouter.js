import express from "express"
import { addBalance, authUser, getDoctors, getUser, loginUser, registerUser, verifyUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/verify",authUser,verifyUser)
router.get("/getdoctors",authUser,getDoctors)
router.patch("/addbalance/:topup",authUser,addBalance)
router.get("/getuser",authUser,getUser);

export default router;