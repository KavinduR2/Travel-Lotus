import React from 'react';
import { BrowserRouter as Router, Route, Routes, Form } from 'react-router-dom';

// Kavindu's Task - Landing page , Login page , home , Landownerhome
// Shehan's Task - Register , Guesthome , chat , Admin register , Contact
// Shenal's Task - Add rooms , housing application , housing application management , rooms
// Kajanan Task - MaintainceManagement , paymentManagement , paymentPage , request maintaince

import Register from './Views/Register';
import Login from './Views/Login';
import Home from './Views/Home';
import LandingPage from './Views/LandingPage';



const App = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>


      <Router>
        <Routes>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
