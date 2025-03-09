//Request maintainence for travel lotus has been added
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore instance
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const RequestMaintenance = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (user) {
    console.log('Logged in user:', user);
  }
  const [formData, setFormData] = useState({
    roomNumber: "",
    fullName: user.email,
    mobile: "",
    reason: "",
    State: "Pending"
  });

  const [rooms, setRooms] = useState([]); // State to store room list

  useEffect(() => {
    // Fetch rooms from Firestore
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, "Rooms"); // Replace "rooms" with your collection name
        const roomSnapshot = await getDocs(roomsCollection);
        const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomList);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
        alert("Failed to load rooms. Please try again.");
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentDate = new Date().toISOString().split("T")[0]; // Extract only the date

      // Add the date to the formData
      const formDataWithDate = {
        ...formData,
        submissionDate: currentDate, // Store only the date
      };

      await addDoc(collection(db, "maintenanceRequests"), formDataWithDate);
      alert("Maintenance request submitted successfully!");

      // Clear form after submission
      setFormData({
        roomNumber: "",
        fullName: "",
        mobile: "",
        reason: "",
        State: ""
      });
    } catch (error) {
      console.error("Error submitting maintenance request: ", error);
      alert("Failed to submit the maintenance request. Please try again.");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">Travel Lotus</Link>
          <div className="navbar-nav">
            <Link to="/home" className="nav-link">Profile</Link>
            <Link to="/rooms" className="nav-link">Rooms</Link>
            <Link to="/RequestMaintenance" className="nav-link">Request Maintenance</Link>
            <Link to="/" className="nav-link">Logout</Link>
          </div>
        </div>
      </nav>

      