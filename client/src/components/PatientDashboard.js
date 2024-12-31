import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [walletChange,setWalletChange] = useState(false);
  const [topup,setTopup] = useState(0);
  const [balance,setBalance] = useState(0);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const token = localStorage.getItem('token');

        const userData = await axios.get("http://localhost:3000/getuser",{
          headers: { token: token },
        });
        setBalance(userData.data.user.balance);

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
  
      const doctor = doctors.find(doc => doc._id === doctorId);
  
      setAppointments([
        ...appointments,
        { ...response.data.appointment, doctor },
      ]);
  
      setBalance(
        balance - response.data.transaction.price + response.data.transaction.discount
      );
  
      if (response.data.discounted) {
        alert("Appointment booked successfully! 20% Discount for you !!");
      } else {
        alert("Appointment booked successfully!");
      }
    } catch (error) {
      console.error(
        "Error creating appointment:",
        error.response?.data || error.message
      );
    }
  };
  

  async function addBalance(){
    const token = localStorage.getItem('token');
    try {
      const val = await axios.patch(`http://localhost:3000/addbalance/${topup}`,{},{
        headers:{
          token:token
        }
      });
      setBalance(val.data.user.balance);
      alert("Balance added!");
    } catch (error) {
      console.log("Error while adding balance: ",error.message);
    }
  }

  return (
    <div>
      <h1>Patient Dashboard</h1>
      <button onClick={() => navigate('/patientReport')}>View Report</button>
      <div>
      <h3>Wallet: ${balance}</h3>
      <button onClick={()=>{setWalletChange(!walletChange)}}>{!walletChange?"TopUp Wallet":"Close"}</button>
      {walletChange?<div>
        Enter amount to topup: <input type='number' min={0} max={200} value={topup} onChange={(e)=>{setTopup(e.target.value)}}/>
        <button onClick={addBalance}>Add amount</button>
      </div>:""}
      </div>
      <div>
        <h2>Your Appointments:</h2>
        {appointments && appointments.length > 0 ? <div>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Appointment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((ele) => (
                  <tr key={ele._id}>
                    <td>{ele.doctor.name}</td>
                    <td>{ele.date.slice(0, 10)}</td>
                    <td>{ele.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> : (
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
