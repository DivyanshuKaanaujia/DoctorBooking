import { Appointment } from "../models/appointmentSchema.js";
import { Patient } from "../models/patientSchema.js";
import { Transaction } from "../models/transactionSchema.js";
import mongoose from "mongoose";

export const makeTransaction = async (req, res) => {
    const { doctorId, price, appointmentDate } = req.body;
    const patientId = req.userId;

    if (!doctorId || !patientId || !price || !appointmentDate) {
        res.status(400).json({ error: "Required fields are missing" });
        return;
    }

    try {
        const isFirstTransaction = await Transaction.findOne({
            doctor: doctorId,
            patient: patientId,
        });

        let discount = 0;
        if (!isFirstTransaction) {
            discount = price * 0.2;
        }

        const finalPrice = price - discount;

        const patient = await Patient.findById(patientId);
        if (patient.balance < finalPrice) {
            res.status(200).json({ message: "Your wallet balance is not sufficient" });
            return;
        }

        patient.balance -= finalPrice;
        await patient.save();

        const transaction = await Transaction.create({
            doctor: doctorId,
            patient: patientId,
            price: price,
            discount: discount,
        });

        const appointment = await Appointment.create({
            doctor: doctorId,
            patient: patientId,
            date: new Date(appointmentDate),
        });

        res.status(200).json({
            message: "Transaction and appointment were successful",
            transaction,
            appointment,
        });

    } catch (error) {
        res.status(500).json({ error: error.message, message: "Error while making transaction or creating appointment" });
    }
};


export const generateReport = async (req, res) => {
    const { startDate, endDate, doctorId, patientId } = req.body;
    const matchCriteria = {};
    if (startDate || endDate) {
        matchCriteria.transaction_date = {};
        if (startDate) matchCriteria.transaction_date.$gte = new Date(startDate);
        if (endDate) matchCriteria.transaction_date.$lte = new Date(endDate);
    }
    if (doctorId) {
        matchCriteria.doctor = new mongoose.Types.ObjectId(doctorId);
    }
    if (patientId) {
        matchCriteria.patient = new mongoose.Types.ObjectId(patientId);;
    }

    try {
        // 1. Discount Usage Report
        const discountUsageReport = await Transaction.aggregate([
            { $match: { ...matchCriteria, discount: { $gt: 0 } } },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctor",
                    foreignField: "_id",
                    as: "doctor",
                },
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "patient",
                    foreignField: "_id",
                    as: "patient",
                },
            },
            { $unwind: "$doctor" },
            { $unwind: "$patient" },
            {
                $project: {
                    doctorName: "$doctor.name",
                    patientName: "$patient.name",
                    consultationDate: "$transaction_date",
                    discountApplied: "$discount",
                },
            },
        ]);

        // 2. Wallet Transactions Report
        const walletTransactionsReport = await Transaction.aggregate([
            { $match: matchCriteria },
            {
                $lookup: {
                    from: "doctors",
                    localField: "doctor",
                    foreignField: "_id",
                    as: "doctor",
                },
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "patient",
                    foreignField: "_id",
                    as: "patient",
                },
            },
            { $unwind: "$doctor" },
            { $unwind: "$patient" },
            {
                $project: {
                    patientName: "$patient.name",
                    doctorName: "$doctor.name",
                    consultationFee: "$price",
                    discount: "$discount",
                    finalWalletDeduction: { $subtract: ["$price", "$discount"] },
                },
            },
        ]);

        // 3. Doctor’s Earnings Report
        const doctorsEarningsReport = await Transaction.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: "$doctor",
                    grossEarnings: { $sum: "$price" },
                    totalDiscounts: { $sum: "$discount" },
                    netEarnings: { $sum: { $subtract: ["$price", "$discount"] } },
                },
            },
            {
                $lookup: {
                    from: "doctors",
                    localField: "_id",
                    foreignField: "_id",
                    as: "doctor",
                },
            },
            { $unwind: "$doctor" },
            {
                $project: {
                    doctorName: "$doctor.name",
                    grossEarnings: 1,
                    discountsGiven: "$totalDiscounts",
                    netEarnings: 1,
                },
            },
        ]);

        // 4. System Summary Report
        const systemSummaryReport = await Transaction.aggregate([
            { $match: matchCriteria },
            {
                $group: {
                    _id: null,
                    totalDiscounts: { $sum: "$discount" },
                    totalWalletDeductions: {
                        $sum: { $subtract: ["$price", "$discount"] },
                    },
                    totalDoctorEarnings: {
                        $sum: { $subtract: ["$price", "$discount"] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalDiscounts: 1,
                    totalWalletDeductions: 1,
                    totalDoctorEarnings: 1,
                },
            },
        ]);

        // Return the aggregated reports
        res.status(200).json({
            discountUsageReport,
            walletTransactionsReport,
            doctorsEarningsReport,
            systemSummaryReport: systemSummaryReport[0] || {},
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
