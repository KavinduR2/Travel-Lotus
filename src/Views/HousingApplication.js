import React, { useState } from "react";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase"; // Import Firestore database instance
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { Container, Row, Col, Form, Button, Card, Offcanvas, Modal } from "react-bootstrap";
import { FaHome, FaBed, FaUser, FaMoneyBillWave, FaExclamationTriangle, FaTools, FaSignOutAlt, FaBars } from "react-icons/fa"; // Import icons from react-icons

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

    const [showSidebar, setShowSidebar] = useState(false); // State for sidebar visibility
    const [showEmergencyModal, setShowEmergencyModal] = useState(false); // State for emergency modal

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
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid px-4">
                    {/* Sidebar Toggle Button */}
                    <Button 
                        variant="outline-light" 
                        className="me-2" 
                        onClick={() => setShowSidebar(true)}
                    >
                        <FaBars size={20} />
                    </Button>
                    
                    {/* Brand Logo */}
                    <div className="d-flex justify-content-center align-items-center flex-grow-1">
                        <img 
                            src="/images/logo.png"
                            alt="Travel Lotus Logo"
                            height="50" 
                            className="me-2"
                        />
                        <Link className="navbar-brand mb-0" to="/home" style={{ 
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            letterSpacing: '1px',
                            textDecoration: 'none'
                        }}>
                            Travel Lotus
                            <span style={{ 
                                fontSize: '0.5em', 
                                display: 'block', 
                                color: '#fff',
                                fontWeight: 'normal',
                                opacity: 0.9
                            }}>
                                Your Journey, Your Way
                            </span>
                        </Link>
                    </div>

                    {/* Emergency Button */}
                    <div className="ms-auto">
                        <Button
                            variant="danger"
                            className="me-2 rounded-pill d-flex align-items-center"
                            onClick={() => setShowEmergencyModal(true)}
                            style={{
                                padding: '0.1rem 0.5rem',
                                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
                                border: '2px solid #ff0000',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <FaExclamationTriangle className="me-2" size={14} />
                            Emergency
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} backdrop="static">
                <Offcanvas.Header className="bg-dark text-white">
                    <Offcanvas.Title>
                        <div className="d-flex align-items-center">
                            <img 
                                src="/images/logo.png"
                                alt="Travel Lotus Logo"
                                height="40"
                                className="me-2"
                            />
                            <div>
                                <div style={{ 
                                    fontSize: '1.5rem', 
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #0069d9, #8e44ad)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    Travel Lotus
                                </div>
                                <span style={{ 
                                    fontSize: '0.7em', 
                                    display: 'block', 
                                    color: '#fff',
                                    fontWeight: 'normal',
                                    opacity: 0.8
                                }}>
                                    Your Journey, Your Way
                                </span>
                            </div>
                        </div>
                    </Offcanvas.Title>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white" 
                        aria-label="Close"
                        onClick={() => setShowSidebar(false)}
                        style={{position: 'absolute', right: '1rem'}}
                    />
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="d-flex flex-column">
                        <div className="p-3 border-bottom">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary rounded-circle p-3 text-white me-3">
                                    <FaUser size={24} />
                                </div>
                                <div>
                                    <h5 className="mb-0">{user ? user.email : 'Guest'}</h5>
                                    <small className="text-muted">Guest Account</small>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-3">
                            <Link to="/home" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaUser className="me-3" /> Profile
                            </Link>
                            <Link to="/rooms" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaBed className="me-3" /> Rooms
                            </Link>
                            <Link to="/RequestMaintenance" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaTools className="me-3" /> Request Maintenance
                            </Link>
                            <Link to="/" className="btn btn-danger w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaSignOutAlt className="me-3" /> Logout
                            </Link>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Main Content */}
            <div style={{
                backgroundImage: `url('/Images/RoomsImge.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#fff',
                paddingTop: '2rem',
                paddingBottom: '5rem',
            }}>
                <Container className="mt-4">
                    <div className="text-center mb-4">
                        <h1 className="display-5 fw-bold" style={{ 
                            color: 'white', 
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '12px 25px',
                            borderRadius: '10px',
                            display: 'inline-block'
                        }}>
                            Housing Application
                        </h1>
                    </div>

                    <Card className="shadow-lg border-0 mb-5 transform-hover" style={{
                        transform: 'translateY(0)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        overflow: 'hidden',
                        borderRadius: '15px',
                        background: 'rgba(255, 255, 255, 0.95)'
                    }}>
                        <Card.Header className="text-white py-3" style={{
                            background: 'linear-gradient(135deg, #4a6bff, #2541b2)',
                            borderBottom: 'none',
                            borderRadius: '15px 15px 0 0'
                        }}>
                            <h4 className="mb-0 fw-bold">Selected Room {roomDetails.RoomNo}</h4>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-4 p-4 rounded" style={{
                                background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                                borderLeft: '4px solid #4a6bff'
                            }}>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="p-2 rounded-circle me-3" style={{ background: 'rgba(74, 107, 255, 0.2)' }}>
                                        <FaHome className="text-primary" size={24} />
                                    </div>
                                    <h5 className="mb-0">Floor: <span className="fw-bold">{roomDetails.Floor}</span></h5>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="p-2 rounded-circle me-3" style={{ background: 'rgba(74, 107, 255, 0.2)' }}>
                                        <FaBed className="text-primary" size={24} />
                                    </div>
                                    <h5 className="mb-0">Available Beds: <span className="fw-bold">{roomDetails.NumberOfBed}</span></h5>
                                </div>
                                {roomDetails.RoomPrice && (
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="p-2 rounded-circle me-3" style={{ background: 'rgba(40, 167, 69, 0.2)' }}>
                                            <FaMoneyBillWave className="text-success" size={24} />
                                        </div>
                                        <h5 className="mb-0">Price: <span className="fw-bold text-success">${roomDetails.RoomPrice}</span></h5>
                                    </div>
                                )}
                                <div className="mt-4 pt-3 border-top">
                                    <h5 className="mb-2 text-primary">Room Description:</h5>
                                    <p className="ms-2 mb-0 fst-italic" style={{ lineHeight: '1.6' }}>{roomDetails.description || "Experience comfort and convenience in our well-appointed room."}</p>
                                </div>
                            </div>
                            
                            {/* Booking Form */}
                            <h4>Booking Details</h4>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-2">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="First Name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Last Name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                name="currentAddress"
                                                value={formData.currentAddress}
                                                onChange={handleChange}
                                                placeholder="Current Address"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleChange}
                                                placeholder="Mobile Number"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Select Status:</Form.Label>
                                    <div className="radio-group">
                                        <Form.Check
                                            type="radio"
                                            label="Travel"
                                            name="status"
                                            value="Travel"
                                            onChange={handleChange}
                                            required
                                        />
                                        
                                        <Form.Check
                                            type="radio"
                                            label="Other"
                                            name="status"
                                            value="Other"
                                            onChange={handleChange}
                                        />
                                    </div>
                                </Form.Group>

                                <Button type="submit" className="submit-button" variant="primary">
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white py-4 w-100">
                <Container>
                    <Row className="text-center text-md-start">
                        <Col md={4} className="mb-3 mb-md-0">
                            <h5 className="mb-3">Travel Lotus</h5>
                            <p className="mb-0">Your Journey, Your Way</p>
                            <p className="mb-0">© 2025 Travel Lotus. All rights reserved.</p>
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0">
                            <h5 className="mb-3">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/home" className="text-white text-decoration-none">Home</Link></li>
                                <li><Link to="/rooms" className="text-white text-decoration-none">Rooms</Link></li>
                                <li><Link to="/requestMaintenance" className="text-white text-decoration-none">Maintenance</Link></li>
                            </ul>
                        </Col>
                        <Col md={4}>
                            <h5 className="mb-3">Contact</h5>
                            <p className="mb-0">Email: TravelLotuscc@gmail.com</p>
                            <p className="mb-0">FaceBook : Travel Lotus</p>
                        </Col>
                    </Row>
                </Container>
            </footer>

            {/* Emergency Modal */}
            <Modal show={showEmergencyModal} onHide={() => setShowEmergencyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Emergency Contacts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="text-center mb-4">**TRAVEL LOTUS SOS**</h5>
                    <p><strong>Travel Lotus Admin Panel:</strong> 0000</p>
                    <p><strong>Sri Lankan Police:</strong> 119</p>
                    <p><strong>Ambulance:</strong> 1990</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEmergencyModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default HousingApplication;

