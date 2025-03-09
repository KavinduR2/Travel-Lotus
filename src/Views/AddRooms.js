import React, { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // Adjust the path to your firebase.js
import { collection, addDoc } from "firebase/firestore";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
 
const AddRooms = () => {
    const [RoomData, setRoomData] = useState({
        RoomNo: "",
        Floor: "",
        NumberOfBed: "",
        description: "",
    });
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData({ ...RoomData, [name]: value });
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Adding static price field to Firestore
            const roomWithPrice = { ...RoomData, RoomPrice: 135.59 };
            const docRef = await addDoc(collection(db, "Rooms"), roomWithPrice);
            console.log("Document written with ID: ", docRef.id);
            alert("Room details added successfully!");
            setRoomData({ RoomNo: "", Floor: "", NumberOfBed: "", description: "" });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add Room details. Please try again.");
        }
    };
    
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">Travel Lotus</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/PaymentManagement" className="nav-link">Payment Management</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/MaintenanceManagement" className="nav-link">Maintenance Management</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/HousingApplicationManagement" className="nav-link">H-Application Management</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/add-room" className="nav-link">Add Rooms</Link>
                            </li>
                            <li className="nav-item" style={{backgroundColor:'red',borderRadius:'10px'}}>
                                <Link to="/" className="nav-link">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
 
            {/* Form */}
            <Container className="mt-5">
                <h2 className="text-center mb-4">Add Room</h2>
                <Card className="mb-5">
                    <Card.Body>
                        <Row className="justify-content-center mt-2">
                            <Col md={6}>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formRoomNo">
                                        <Form.Label>Room No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="RoomNo"
                                            value={RoomData.RoomNo}
                                            onChange={handleChange}
                                            placeholder="Enter room number"
                                            required
                                        />
                                    </Form.Group>
 
                                    <Form.Group className="mb-3" controlId="formFloor">
                                        <Form.Label>Floor</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Floor"
                                            value={RoomData.Floor}
                                            onChange={handleChange}
                                            placeholder="Enter floor number"
                                            required
                                        />
                                    </Form.Group>
 
                                    <Form.Group className="mb-3" controlId="formNumberOfBed">
                                        <Form.Label>Number of Beds</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="NumberOfBed"
                                            value={RoomData.NumberOfBed}
                                            onChange={handleChange}
                                            placeholder="Enter number of beds"
                                            required
                                            min="1"
                                        />
                                    </Form.Group>
 
                                    {/* Display Static Room Price */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Room Price (Please Enter USD)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value="135.59"
                                            disabled
                                        />
                                    </Form.Group>
 
                                    <Form.Group className="mb-3" controlId="formDescription">
                                        <Form.Label>Description (Optional)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={RoomData.description}
                                            onChange={handleChange}
                                            placeholder="Enter additional details about the room"
                                        />
                                    </Form.Group>
 
                                    <Button variant="primary" type="submit" className="w-100">
                                        Add Room
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
 
            {/* Footer */}
            <footer className="bg-light text-center py-3" style={{ marginTop: "100px" }}>
                <Container>
                    <p>&copy; 2025 TRAVEL LOTUS. All rights reserved.</p>
                    <p><Link to="/contact">Contact Us</Link> | <Link to="/privacy">Privacy Policy</Link></p>
                </Container>
            </footer>
        </>
    );
};
 
export default AddRooms;