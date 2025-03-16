import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore"; // Firestore imports
import { db } from "../firebase"; // Update this path to match our Firebase config file
import { Container, Row, Col, Card, Button, Spinner, Form, ListGroup, Modal } from "react-bootstrap";
import { FaBed, FaHome, FaMoneyBillWave, FaExclamationTriangle, FaTools, FaSignOutAlt, FaComment, FaBars, FaUser } from "react-icons/fa"; // Import icons from react-icons

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
    const [showSidebar, setShowSidebar] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        fetchMessages();
    };
    const handleCloseSidebar = () => setShowSidebar(false);

    // Fetch messages
    const fetchMessages = async () => {
        setChatLoading(true);
        try {
            const q = query(
                collection(db, 'chats'),
                where('GuestEmail', '==', user.email)
            );
    
            const querySnapshot = await getDocs(q);
            const chats = [];
            querySnapshot.forEach((doc) => {
                chats.push(doc.data());
            });
    
            // Sort messages in ascending order based on timestamp
            const sortedChats = sortMessagesByTimestamp(chats);
    
            setMessages(sortedChats);
            setChatLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setChatLoading(false);
        }
    };

    // Function to sort messages by timestamp in ascending order
    const sortMessagesByTimestamp = (messages) => {
        return messages.sort((a, b) => a.timestamp - b.timestamp);
    };

    // Send a new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const newMessageData = {
                GuestEmail: user.email,
                landownerEmail: "landowner@example.com",
                message: newMessage.trim(),
                timestamp: new Date(),
                Sender: user.email,
            };

            await addDoc(collection(db, 'chats'), newMessageData);

            // Append the new message to the existing messages
            setMessages([...messages, newMessageData]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };    

    // Get user from session storage
    const user = JSON.parse(sessionStorage.getItem('user'));

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
                <div className="container-fluid px-4">
                    {/* Menu Toggle Button */}
                    <Button 
                        variant="outline-light" 
                        className="me-2" 
                        onClick={() => setShowSidebar(true)}
                    >
                        <FaBars size={20} />
                    </Button>
                    
                    {/* Centered Logo */}
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
 
            {/* Sidebar Navigation */}
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
                        onClick={handleCloseSidebar}
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
                    {/* Currency selection field with improved styling */}
                    <div className="text-center mb-4">
                        <h1 className="display-5 fw-bold" style={{ 
                            color: 'white', 
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '12px 25px',
                            borderRadius: '10px',
                            display: 'inline-block'
                        }}>
                            Available Rooms
                        </h1>
                    </div>
                    
                    <Row className="mb-4 justify-content-center">
                        <Col md={4} lg={3}>
                            <Card className="shadow border-0">
                                <Card.Body>
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
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="light" size="lg" />
                            <p className="mt-3 text-white">Loading available rooms...</p>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center">
                            <Card className="shadow-lg border-0 p-4">
                                <Card.Body>
                                    <p className="mb-0">No rooms available at the moment.</p>
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        <Row>
                            {rooms.map((room) => (
                                <Col key={room.id} md={6} lg={4} className="mb-4">
                                    <Card className="shadow-lg border-0 h-100 transform-hover" style={{
                                        transform: 'translateY(0)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '';
                                    }}>
                                        <Card.Header className="bg-primary text-white py-3">
                                            <h4 className="mb-0">Room {room.RoomNo}</h4>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="mb-3 p-2 bg-light rounded">
                                                <div className="d-flex align-items-center mb-2">
                                                    <FaHome className="me-2 text-primary" size={18} />
                                                    <h5 className="mb-0">Floor: {room.Floor}</h5>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <FaBed className="me-2 text-primary" size={18} />
                                                    <span><strong>Beds:</strong> {room.NumberOfBed}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <FaMoneyBillWave className="me-2 text-success" size={18} />
                                                    <span><strong>Price:</strong> {room.RoomPrice ?
                                                        (room.RoomPrice * currencyRates[currency]).toFixed(2) + " " + currency : "N/A"}</span>
                                                </div>
                                            </div>
                                            <p><strong>Description:</strong><br/>{room.description}</p>
                                        </Card.Body>
                                        <Card.Footer className="bg-white border-0 pb-3">
                                            <Button
                                                variant={room.NumberOfBed === 0 ? "secondary" : "primary"}
                                                disabled={room.NumberOfBed === 0}
                                                onClick={() => handleApply(room)}
                                                className="w-100"
                                                size="lg"
                                            >
                                                {room.NumberOfBed === 0 ? "Unavailable" : "Apply Now"}
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </div>

            {/* Chat Button */}
            <Button 
                onClick={handleShow}
                className="chat-button"
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#0069d9',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    border: 'none',
                    zIndex: 1000
                }}
            >
                <FaComment size={24} />
            </Button>

            {/* Chat Offcanvas */}
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton className="bg-primary text-white">
                    <Offcanvas.Title>Chat with Landlord</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {chatLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <div className="chat-container" style={{ height: '70vh', overflowY: 'auto' }}>
                            <ListGroup>
                                {messages.map((msg, index) => (
                                    <ListGroup.Item 
                                        key={index} 
                                        className={`mb-2 rounded ${msg.Sender === user?.email ? "bg-primary text-white ms-auto" : "bg-light"}`}
                                        style={{ 
                                            maxWidth: '80%', 
                                            width: 'fit-content',
                                            border: 'none',
                                            padding: '10px 15px',
                                            margin: msg.Sender === user?.email ? '0 0 10px auto' : '0 auto 10px 0'
                                        }}
                                    >
                                        <div>
                                            <strong>{msg.Sender === user?.email ? "You" : "Landlord"}</strong>
                                        </div>
                                        <div>{msg.message}</div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    )}

                    <Form.Group className="mt-3 position-fixed" style={{ bottom: '20px', left: '20px', right: '20px' }}>
                        <div className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="me-2"
                            />
                            <Button onClick={sendMessage} variant="primary">
                                Send
                            </Button>
                        </div>
                    </Form.Group>
                </Offcanvas.Body>
            </Offcanvas>

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
 
export default Rooms;
