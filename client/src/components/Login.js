import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      if (!email || !password) {
        alert("Please fill all the required fields");
        return;
      }

      let logUser = await axios.post(`http://localhost:3000/login`, {
        email: email,
        password: password,
        role: role ? "doctor" : "patient"
      });
      localStorage.setItem("token",logUser.data.token)
      navigate('../')
    } catch (error) {
      console.error("Error while logging in:", error.response?.data || error);
      alert("Error during loggin in: " + (error.response?.data.error || "Unknown error"));
    }
  }

  return (
      <div>

    <form onSubmit={handleLogin}>
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
    Are you a Doctor?{" "}
    <input
      type="checkbox"
      name="role"
      checked={role}
      onChange={() => setRole(!role)}
    />
    <button type="submit">Login</button>
  </form>
  <a href={'../register'}>Go to Register</a>
  </div>
  
  )
}

export default Login