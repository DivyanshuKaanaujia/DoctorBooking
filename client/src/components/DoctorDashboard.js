import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
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
      <button onClick={() => navigate('/doctorReport')}>View Report</button>
      <div>
        {appointments && appointments.length > 0 ? (
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Appointment Date</th>
                <th>Status</th>
                <th>Contact Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((ele) => (
                <tr key={ele._id}>
                  <td>{ele.patient.name}</td>
                  <td>{ele.date.slice(0, 10)}</td>
                  <td>{ele.status}</td>
                  <td>
                    <a href={`mailto:${ele.patient.email}`}>{ele.patient.email}</a>
                  </td>
                  <td>
                  {ele.status === 'pending'?<button onClick={() => updateStatus(ele._id, "completed")}>
                      Mark Completed
                    </button>:<button onClick={() => updateStatus(ele._id, "pending")}>
                      Mark Pending
                    </button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
