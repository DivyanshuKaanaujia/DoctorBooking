import { Appointment } from "../models/appointmentSchema.js";

export const getAppointment = async (req, res) => {
    try {
        const doctorId = req.userId;
        let appointments = await Appointment.find({ doctor: doctorId })
            .populate('patient', 'name email')
            .sort({ date: 1 });
        if(appointments.length == 0){
            const patientId = req.userId;
            appointments = await Appointment.find({ patient: patientId })
            .populate('doctor', 'name email')
            .sort({ date: 1 });
        }
            res.status(200).json({ appointments });
        } catch (error) {
        res.status(500).json({ error: 'Error fetching appointments' });
    }
}

export const updateAppointmentStatus = async (req, res) => {
    const {appointmentId} = req.params;
    const { status } = req.body;

    if (!['completed', 'canceled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        ).populate('patient', 'name email');

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};