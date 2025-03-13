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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const applicationData = {
                ...formData,
                roomId: roomDetails.id,
                submissionDate: new Date().toISOString() // Add the current date in ISO format
            };
            await addDoc(collection(db, "housingApplications"), applicationData); // Save data to Firestore
            console.log("Form Submitted: ", applicationData);

            const roomDocRef = doc(db, "Rooms", roomDetails.id); // Reference to the specific room document
            const roomDoc = await getDoc(roomDocRef); // Fetch the latest room document

            if (roomDoc.exists()) {
                const roomData = roomDoc.data();
                const updatedNumberOfBed = roomData.NumberOfBed - 1; // Decrement the bed count

                if (updatedNumberOfBed >= 0) {
                    await updateDoc(roomDocRef, { NumberOfBed: updatedNumberOfBed }); // Update the document in Firestore
                    alert("Application Submitted and Room Updated Successfully!");
                    navigate('/home'); // Navigate to the home page
                } else {
                    alert("No beds available in the selected room!");
                }
            } else {
                alert("Room does not exist in the database!");
            }
        } catch (error) {
            console.error("Error processing application: ", error);
            alert("Failed to submit application. Please try again.");
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">CRIBCLIQUE</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/home" className="nav-link">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/rooms" className="nav-link">Rooms</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/RequestMaintenance" className="nav-link">Request Maintenance</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

