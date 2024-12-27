import express from "express"
import userRouter from "./userRouter.js"
import transactionRouter from "./transactionRouter.js"

const router = express.Router();

router.use("/",userRouter)
router.use("/transaction",transactionRouter)
// router.use()

export default router;