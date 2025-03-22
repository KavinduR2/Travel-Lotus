import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, query, where} from 'firebase/firestore';
import { db } from '../firebase';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, ListGroup, Modal } from 'react-bootstrap';
import { FaBars, FaExclamationTriangle, FaUser, FaBed, FaTools, FaSignOutAlt } from 'react-icons/fa';

const GuestHome = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const handleCloseSidebar = () => setShowSidebar(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [acceptedRooms, setAcceptedRooms] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [show, setShow] = useState(false);
 
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const landownerEmail = "landowner@example.com";
 
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        fetchMessages();
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toISOString().split("T")[0];
    };
 
    // Fetch accepted rooms
    useEffect(() => {
        const fetchAcceptedRooms = async () => {
            if (!user) return;
 
            try {
                const querySnapshot = await getDocs(collection(db, 'housingApplications'));
                const rooms = [];
                querySnapshot.forEach((doc) => {
                    rooms.push({ id: doc.id, ...doc.data() });
                });
 
                setAcceptedRooms(rooms.filter(room => room.email === user.email));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accepted rooms:', error);
                setLoading(false);
            }
        };
 
        fetchAcceptedRooms();
    }, [user]);

    // Fetch maintenance requests
    useEffect(() => {
        const fetchAllMaintenanceRequests = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'maintenanceRequests'));
                const records = [];
                querySnapshot.forEach((doc) => {
                    records.push({ id: doc.id, ...doc.data() });
                });
 
                setMaintenanceRequests(records.filter(records => records.fullName === user.email));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching maintenance requests:', error);
                setLoading(false);
            }
        };
 
        fetchAllMaintenanceRequests();
    }, [user?.email]);
 
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
                landownerEmail,
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
 
    console.log(messages);
 
 
    return (
        < >
        
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
                                        className={`mb-2 rounded ${msg.Sender === user.email ? "bg-primary text-white ms-auto" : "bg-light"}`}
                                        style={{ 
                                            maxWidth: '80%', 
                                            width: 'fit-content',
                                            border: 'none',
                                            padding: '10px 15px',
                                            margin: msg.Sender === user.email ? '0 0 10px auto' : '0 auto 10px 0'
                                        }}
                                    >
                                        <div>
                                            <strong>{msg.Sender === user.email ? "You" : "Landlord"}</strong>
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

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                <div
                    style={{
                        backgroundImage: `url('/Images/GuestHome.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '2rem',
                        paddingBottom: '5rem',
                        position: 'relative'
                    }}>

                <Container>
                    <div className="text-center mb-4">
                        <h1 className="display-5 fw-bold" style={{ 
                            color: 'white', 
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '12px 25px',
                            borderRadius: '10px',
                            display: 'inline-block'
                        }}>
                            Guest Dashboard
                        </h1>
                    </div>
                    
                    <div className="welcome-banner p-3 mb-4 rounded text-center" style={{
                        backgroundColor: '#0d6efd', // Bootstrap's primary blue color
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        borderRadius: '15px'
                    }}>
                        <h3 className="mb-0">Welcome, {user ? (user.email.includes('@') ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : user.email) : 'Guest'}!</h3>
                        <p className="mb-0 mt-2">We're glad to have you here. Enjoy your stay with Travel Lotus.</p>
                    </div>

                    <Row className="g-4">
                        {/* Your Rooms Card */}
                        <Col md={6}>
                            <Card className="h-100 shadow-lg border-0 rounded-lg" style={{ 
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                minHeight: '400px' // Added minimum height
                            }}>
                                <Card.Header className="bg-primary text-white p-3"> {/* Added padding */}
                                    <h4 className="mb-0">Your Rooms</h4>
                                </Card.Header>
                                <Card.Body className="p-4"> 
                                    {loading ? (
                                        <div className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                            <p>Loading rooms...</p>
                                        </div>
                                    ) : acceptedRooms.length === 0 ? (
                                        <Alert variant="info" className="text-center">
                                            No accepted rooms yet.
                                        </Alert>
                                    ) : (
                                        <ul className="list-group">
                                            {acceptedRooms.map((room) => (
                                                <li key={room.id} className="list-group-item mb-3 border-0 shadow-sm">
                                                    <div><strong>Room Number:</strong> {room.RoomNo}</div>
                                                    <div><strong>Submission Date:</strong> {formatDate(room.submissionDate)}</div>
                                                    <div><strong>Application Status:</strong> {room.application}</div>
                                                    {room.application === 'Accepted' && (
                                                        <Button
                                                            onClick={() => navigate('/payment', { state: { roomId: room.id } })}
                                                            className="mt-2"
                                                            variant="primary"
                                                        >
                                                            Make Payment
                                                        </Button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Maintenance Requests Card */}
                        <Col md={6}>
                            <Card className="h-100 shadow-lg border-0 rounded-lg" style={{ 
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                minHeight: '400px' // Added minimum height
                            }}>
                                <Card.Header className="bg-primary text-white p-3"> {/* Added padding */}
                                    <h4 className="mb-0">Maintenance Requests</h4>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    {loading ? (
                                        <div className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                            <p>Loading Records...</p>
                                        </div>
                                    ) : maintenanceRequests.length === 0 ? (
                                        <Alert variant="info" className="text-center">
                                            No maintenance records found.
                                        </Alert>
                                    ) : (
                                        <ul className="list-group">
                                            {maintenanceRequests.map((request) => (
                                                <li key={request.id} className="list-group-item mb-3 border-0 shadow-sm">
                                                    <div><strong>Room Number:</strong> {request.roomNumber}</div>
                                                    <div><strong>Submission Date:</strong> {formatDate(request.submissionDate)}</div>
                                                    <div><strong>Status:</strong> {request.status || 'Pending'}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
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
            </div>
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

export default GuestHome;
