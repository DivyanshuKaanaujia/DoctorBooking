import express from "express"
import userRouter from "./userRouter.js"

const router = express.Router();

router.use("/",userRouter)
// router.use()

export default router;