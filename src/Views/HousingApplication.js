import React, { useState } from "react";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase"; // Import Firestore database instance
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const HousingApplication = () => {
    const location = useLocation(); // Access location object
    const navigate = useNavigate(); // Define navigate function
    const roomDetails = location.state?.roomDetails; // Get room details from state

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        console.log('Logged in user:', user);
    }

    const [formData, setFormData] = useState({
        email: user.email,
        firstName: "",
        lastName: "",
        RoomNo: roomDetails.RoomNo,
        currentAddress: "",
        mobileNumber: "",
        status: "",
        application: "Pending"
    });
