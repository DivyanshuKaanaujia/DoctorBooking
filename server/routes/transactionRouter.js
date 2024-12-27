import express from "express"
import { authUser } from "../controllers/userController.js";
import { generateReport, makeTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/",authUser,makeTransaction)
router.post("/getreport",generateReport)

export default router