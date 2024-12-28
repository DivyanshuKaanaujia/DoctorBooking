import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [fee, setFee] = useState(0);

  async function handleRegister(e) {
    e.preventDefault();
    try {
      if (!name || !email || !password || (role && (!specialization || !fee))) {
        alert("Please fill all the required fields");
        return;
      }

      let regUser = await axios.post(`http://localhost:3000/register`, {
        name: name,
        email: email,
        password: password,
        role: role ? "doctor" : "patient",
        specialization: role ? specialization : undefined,
        consultation_fee: role ? Number(fee) : undefined,
      });

      console.log("User Registered", regUser);
      navigate('../login')
    } catch (error) {
      console.error("Error while registering:", error.response?.data || error);
      alert("Error during registration: " + (error.response?.data.error || "Unknown error"));
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Your Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Your Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      Applying as Doctor?{" "}
      <input
        type="checkbox"
        name="role"
        checked={role}
        onChange={() => setRole(!role)}
      />
      {role ? (
        <div>
          <input
            type="text"
            placeholder="Your Specialization"
            name="specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <input
            type="number"
            placeholder="Your Fees"
            name="fee"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </div>
      ) : (
        ""
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
