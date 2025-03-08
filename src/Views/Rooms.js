import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; // Firestore imports
import { db } from "../firebase"; // Update this path to match our Firebase config file
import { Container, Row, Col, Card, Button, Spinner, Form } from "react-bootstrap";
import { FaBed, FaHome, FaMoneyBillWave } from "react-icons/fa"; // Import icons from react-icons

// Currency conversion rates
const currencyRates = {
    LKR: 299,
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    INR: 82.5,
    KES: 150, // Example conversion rate
};

const Rooms = () => {
    const [rooms, setRooms] = useState([]); // State to hold rooms data
    const [loading, setLoading] = useState(true); // Loading state
    const [currency, setCurrency] = useState("USD"); // Default currency
    const navigate = useNavigate(); // React Router navigate function

    // Fetch rooms data from Firestore
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Rooms"));
                const roomData = [];
                querySnapshot.forEach((doc) => {
                    roomData.push({ id: doc.id, ...doc.data() });
                });
                setRooms(roomData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching rooms: ", error);
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    // Handle Apply button click
    const handleApply = (room) => {
        navigate("/housing-application", { state: { roomDetails: room } });
    };
 
    // Handle currency change
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };
 
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">Travel Lotus</Link>
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
 
            <div
                style={{
                    backgroundImage: `url('/Images/RoomsImge.webp')`, // Reference image in public folder
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    //justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff', // White text on the dark background
                }}>
 
            <Container className="mt-4">
                {/* Currency selection field */}
                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group controlId="currencySelect">
                            <Form.Label><strong>Select Currency:</strong></Form.Label>
                            <Form.Select value={currency} onChange={handleCurrencyChange}>
                                <option value="LKR">LKR (Rs)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="KES">KES (KSh)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
 
                <h2 className="text-center mb-4">Apartment Rooms</h2>
 
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : rooms.length === 0 ? (
                    <p>No rooms available.</p>
                ) : (
                    <Row>
                        {rooms.map((room) => (
                            <Col key={room.id} md={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title><FaHome /> Room No: {room.RoomNo}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Floor: {room.Floor}</Card.Subtitle>
                                        <Card.Text>
                                            <FaBed /> <strong>Number of Beds:</strong> {room.NumberOfBed} <br />
                                            <strong>Description:</strong> {room.description} <br />
                                            <FaMoneyBillWave /> <strong>Price:</strong> {room.RoomPrice ?
                                            (room.RoomPrice * currencyRates[currency]).toFixed(2) + " " + currency : "N/A"}
                                        </Card.Text>
                                        <Button
                                            variant={room.NumberOfBed === 0 ? "secondary" : "primary"}
                                            disabled={room.NumberOfBed === 0}
                                            onClick={() => handleApply(room)}
                                        >
                                            {room.NumberOfBed === 0 ? "Unavailable" : "Apply"}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
            </div>
        </>
    );
 