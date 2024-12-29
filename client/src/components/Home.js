import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DoctorDashboard from './DoctorDashboard.js';
import PatientDashboard from './PatientDashboard.js';

const Home = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    async function verifyUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log("No token, User not logged in");
          navigate("../login");
        }

        const verify = await axios.post("http://localhost:3000/verify", {}, {
          headers: { token: token },
        });

        if (!verify.data.isVerified) {
          navigate("../login");
        }

        setRole(verify.data.role);
      } catch (error) {
        console.error("Authorization error:", error.response?.data || error.message);
        navigate("../login");
      }
    }
    verifyUser();
  }, [navigate]);

  return (
    <div>
      <nav>
        <button onClick={() => { localStorage.clear(); navigate("../login"); }}>Logout</button>
      </nav>
      {role === "doctor" && <DoctorDashboard />}
      {role === "patient" && <PatientDashboard />}
    </div>
  );
};

export default Home;
