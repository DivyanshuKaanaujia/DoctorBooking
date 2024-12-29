import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/appointment/getall", {
          headers: { token: token },
        });
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error.response?.data || error.message);
      }
    }
    fetchAppointments();
  }, []);

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:3000/appointment/update/${appointmentId}`,
        { status: newStatus },
        { headers: { token: token } }
      );
      console.log("Appointment Status Updated:", response.data);

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <div>
        {appointments && appointments.length > 0 ? (
          appointments.map((ele) => (
            <div key={ele._id}>
              <div><b>Patient Name:</b> {ele.patient.name}</div>
              <div><b>Appointment Date: </b> {ele.date.slice(0, 10)}</div>
              <div><b>Status: </b> {ele.status}</div>
              <div><b>Contact Details: </b> <a href={`mailto:${ele.patient.email}`}>{ele.patient.email}</a></div>
              <div>
                <button onClick={() => updateStatus(ele._id, "completed")}>Mark Completed</button>
              </div>
            </div>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
