import axios from 'axios';
import React, { useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  function logoutHandler(){
    localStorage.clear('token');
    navigate("../login")
  }

  useEffect(()=>{
    async function verifyUser(){
        try {
            const token = localStorage.getItem('token');
            if(!token){
                console.log("No token, User not logged in");
                navigate("../login");
            }
            const verify = await axios.post("http://localhost:3000/verify",{},{
                headers:{
                    token:token
                }
            });
            if(!verify.data.isVerified){
                navigate('../login')
            }
        } catch (error) {
            console.error("Authorization error:", error.response?.data || error.message);
            navigate("../login");
        }
    }
    verifyUser();
  },[navigate])

  return (
    <div>
        <nav>
            <button onClick={logoutHandler}>Logout</button>
        </nav>
        <div>
            
        </div>
    </div>
  )
}

export default Home