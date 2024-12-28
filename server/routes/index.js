import express from "express"
import userRouter from "./userRouter.js"
import transactionRouter from "./transactionRouter.js"
import appointmentRouter from "./appointmentRouter.js"

const router = express.Router();

router.use("/",userRouter)
router.use("/transaction",transactionRouter)
router.use("/appointment",appointmentRouter)
// router.use()

export default router;