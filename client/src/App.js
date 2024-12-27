import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from './components/Register';
import Login from './components/Login';
// import dotenv from 'dotenv'

// dotenv.config({path:"./config/variables.env"})

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
