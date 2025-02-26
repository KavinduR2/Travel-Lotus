import React from 'react';
import { BrowserRouter as Router, Route, Routes, Form } from 'react-router-dom';

import Login from './Views/Login';
import LandingPage from './Views/LandingPage';
import Register from './Views/Register';

// shenal task first comment

const App = () => {
  return (
    <div style={{ backgroundColor: '#ffcb13', minHeight: '100vh' }}>


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
