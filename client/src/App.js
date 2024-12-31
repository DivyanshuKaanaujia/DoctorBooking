import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import PatientReport from './components/Report/PatientReport'
import DoctorReport from './components/Report/DoctorReport'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/patientReport' element = {<PatientReport/>}/>
        <Route path='/doctorReport' element = {<DoctorReport/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
