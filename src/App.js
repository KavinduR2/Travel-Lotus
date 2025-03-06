import React from 'react';
import { BrowserRouter as Router, Route, Routes, Form } from 'react-router-dom';

// Kavindu's Task - Landing page , Login page , home , Landownerhome
// Shehan's Task - Register , Guesthome , chat , Admin register , Contact
// Shenal's Task - Add rooms , housing application , housing application management , rooms
// Kajanan Task - MaintainceManagement , paymentManagement , paymentPage , request maintaince

import Login from './Views/Login';
import LandingPage from './Views/LandingPage';
import Register from './Views/Register';


const App = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>


      <Router>
        <Routes>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/' element={<LandingPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
