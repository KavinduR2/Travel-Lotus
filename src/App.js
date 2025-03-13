import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Kavindu's Task - Landing page , Login page , home , Landownerhome
// Shehan's Task - Register , Guesthome , chat , Admin register , Contact
// Shenal's Task - Add rooms , housing application , housing application management , rooms
// Kajanan Task - MaintainceManagement , paymentManagement , paymentPage , request maintaince

import Register from './Views/Register';
import Login from './Views/Login';
import Home from './Views/Home';
import GuestHome from './Views/GuestHome';
import LandOwnerHome from './Views/LandOwnerHome';

import PaymentManagement from './Views/PaymentManagement';
import Rooms from './Views/Rooms';
import RequestMaintenance from './Views/RequestMaintenance' 

//import functions to the Guestprofile
import PaymentPage from './Views/PaymentPage';
import AdminRegister from './Views/AdminRegister';
import LandingPage from './Views/LandingPage';
import Chat from './Views/Chat';



const App = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>


      <Router>
        <Routes>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/Guest-home" element={<GuestHome />} />
          <Route path="/landowner-home" element={<LandOwnerHome />} />
          
          <Route path="/PaymentManagement" element={<PaymentManagement />} />
          <Route path="/RequestMaintenance" element={<RequestMaintenance />} />

          {/* <Route path="/Guest-profile" element={<GuestProfile />} />  */}
          {/* <Route path="/profile" element={<GuestProfile />} /> */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/chat/:GuestEmail" element={<Chat />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          
        </Routes>
      </Router>
    </div>
  );
};

export default App;
