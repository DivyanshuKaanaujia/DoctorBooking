import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' }
});


export const Appointment = mongoose.model("Appointment",appointmentSchema)