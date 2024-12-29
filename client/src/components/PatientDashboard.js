import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const token = localStorage.getItem('token');

        const appointmentsResponse = await axios.get(
          "http://localhost:3000/appointment/getall",
          {
            headers: { token: token },
          }
        );
        setAppointments(appointmentsResponse.data.appointments);

        const doctorsResponse = await axios.get(
          "http://localhost:3000/getdoctors",
          {
            headers: { token: token },
          }
        );
        setDoctors(doctorsResponse.data.doctors);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    }
    fetchInitialData();
  }, []);

  const handleNewAppointment = async (doctorId, price) => {
    if (!appointmentDate) {
      alert("Please select an appointment date.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:3000/transaction",
        { doctorId, price, appointmentDate },
        {
          headers: { token: token },
        }
      );
      setAppointments([...appointments, response.data.appointment]);
      if(response.data.discounted){
        alert("Appointment booked successfully! 20% Discount for you !!");
      }
      else alert("Appointment booked successfully!");
    } catch (error) {
      console.error(
        "Error creating appointment:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h1>Patient Dashboard</h1>

      <div>
        <h2>Your Appointments:</h2>
        {appointments && appointments.length > 0 ? (
          appointments.map((ele) => (
            <div key={ele._id}>
              <div>
                <b>Doctor:</b> {ele.doctor.name}
              </div>
              <div>
                <b>Appointment Date:</b> {ele.date.slice(0, 10)}
              </div>
              <div>
                <b>Status:</b> {ele.status}
              </div>
            </div>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </div>

      <div>
        <h2>Available Doctors</h2>
        {doctors && doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <div><b>Name:</b> {doctor.name}</div>
              <div><b>Specialization:</b> {doctor.specialization}</div>
              <div><b>Consultation Fee:</b> ${doctor.consultation_fee}</div>
              <div>
                <label>
                  <b>Select Appointment Date:</b>
                  <input
                    type="date"
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </label>
              </div>
              <button onClick={() => handleNewAppointment(doctor._id, doctor.consultation_fee)}>
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p>No doctors available.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
