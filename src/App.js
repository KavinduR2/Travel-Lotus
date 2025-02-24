import React from 'react';
import { BrowserRouter as Router, Route, Routes, Form } from 'react-router-dom';
import Register from './Views/Register';
import Login from './Views/Login';
import Home from './Views/Home';
import StudentHome from './Views/StudentHome';
import LandOwnerHome from './Views/LandOwnerHome';
// import HomeLanding from './Views/HomeLanding';
import HousingApplication from './Views/HousingApplication';
import AddRooms from './Views/AddRooms';
import PaymentManagement from './Views/PaymentManagement';
import MaintenanceManagement from './Views/MaintenanceManagement';
import HousingApplicationManagement from './Views/HousingApplicationManagement';
import Rooms from './Views/Rooms';
import RequestMaintenance from './Views/RequestMaintenance';
// import StudentProfile from './Views/StudentProfile';
import PaymentPage from './Views/PaymentPage';
import Chat from './Views/Chat';
import AdminRegister from './Views/AdminRegister';

// comment
//comment 2
// comment 3

const App = () => {
  return (
    <div style={{ backgroundColor: '#ffcb13', minHeight: '100vh' }}>


      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/" element={<Login />} />
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/landowner-home" element={<LandOwnerHome />} />
          {/* <Route path="/landing" element={<HomeLanding />} /> */}
          <Route path="/housing-application" element={<HousingApplication />} />
          <Route path="/add-room" element={<AddRooms />} />
          <Route path="/PaymentManagement" element={<PaymentManagement />} />
          <Route path="/MaintenanceManagement" element={<MaintenanceManagement />} />
          <Route path="/HousingApplicationManagement" element={<HousingApplicationManagement />} />
          <Route path="/RequestMaintenance" element={<RequestMaintenance />} />
          {/* <Route path="/student-profile" element={<StudentProfile />} />  */}
          {/* <Route path="/profile" element={<StudentProfile />} /> */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/chat/:studentEmail" element={<Chat />} />
          <Route path="/admin-register" element={<AdminRegister />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
