import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Modal, Form, Offcanvas, Badge } from 'react-bootstrap';
import { collection, getDocs, addDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FaHome, FaMoneyBillWave, FaTools, FaSignOutAlt, FaComment, FaBars, FaUser, FaEnvelope, FaExclamationTriangle,FaBed,FaFileAlt} from 'react-icons/fa';

const LandOwnerHome = ({ userDetails }) => {
    const [chats, setChats] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const navigate = useNavigate();

    // for dashboard data dynamic

    const [totalRooms, setTotalRooms] = useState(0);
    const [activeRooms, setActiveRooms] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);
    const [maintenanceRequests, setMaintenanceRequests] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);
    const [activeTenants, setActiveTenants] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, [userDetails]);
    
    const fetchDashboardData = async () => {
        if (!userDetails) return;
        
        try {
            // Fetch rooms
            const roomsRef = collection(db, 'Rooms');
            const roomsSnapshot = await getDocs(roomsRef);
            const totalRoomsCount = roomsSnapshot.size;
            setTotalRooms(totalRoomsCount);
            
            // Count active rooms (rooms with beds available)
            let activeRoomsCount = 0;
            roomsSnapshot.forEach(doc => {
                const roomData = doc.data();
                if (roomData.NumberOfBed > 0) {
                    activeRoomsCount++;
                }
            });
            setActiveRooms(activeRoomsCount);
            
            // Fetch applications
            const applicationsRef = collection(db, 'HousingApplications');
            const applicationsSnapshot = await getDocs(applicationsRef);
            setTotalApplications(applicationsSnapshot.size);
            
            // Fetch maintenance requests
            const maintenanceRef = collection(db, 'maintenanceRequests');
            const maintenanceSnapshot = await getDocs(maintenanceRef);
            setMaintenanceRequests(maintenanceSnapshot.size);
            
            // Count total messages
            const totalMessageCount = Object.keys(chats).length;
            setTotalMessages(totalMessageCount);
            
            // Count pending payments (you may need to adjust this query)
            const paymentsRef = collection(db, 'Payments');
            const pendingPaymentsQuery = query(paymentsRef, where('status', '==', 'pending'));
            const pendingPaymentsSnapshot = await getDocs(pendingPaymentsQuery);
            setPendingPayments(pendingPaymentsSnapshot.size);
            
            // Count active tenants (you may need to adjust this query)
            const tenantsRef = collection(db, 'users');
            const tenantsQuery = query(tenantsRef, where('role', '==', 'tenant'), where('status', '==', 'active'));
            const tenantsSnapshot = await getDocs(tenantsQuery);
            setActiveTenants(tenantsSnapshot.size);
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    // const user = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        fetchChats();
    }, []);
    console.log(userDetails);


    const fetchChats = async () => {
        if (!userDetails) return;

        setLoading(true);
        try {
            const chatsRef = collection(db, 'chats');
            const q = query(chatsRef, orderBy('timestamp', 'asc')); // Fetch chats in ascending order
            const querySnapshot = await getDocs(q);

            const groupedChats = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!groupedChats[data.GuestEmail]) {
                    groupedChats[data.GuestEmail] = [];
                }

                groupedChats[data.GuestEmail].push({
                    id: doc.id,
                    message: data.message,
                    Sender: data.Sender,
                    timestamp: data.timestamp.toDate(),
                });
            });

            setChats(groupedChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
        setLoading(false);
    };

    const handleViewChat = async (GuestEmail) => {
        setSelectedGuest(GuestEmail);
    
        // Mark messages as read when opened
        const updatedMessages = chats[GuestEmail].map(msg => {
            if (msg.Sender !== 'Landowner') {
                return { ...msg, read: true };
            }
            return msg;
        });
        
        // Update the local chats state
        const updatedChats = { ...chats };
        updatedChats[GuestEmail] = updatedMessages;
        setChats(updatedChats);
        
        // Set the chat messages
        setChatMessages([...updatedMessages]);
        setShowModal(true);
    };

    console.log(chatMessages);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedGuest) return;

        try {
            const chatsRef = collection(db, 'chats');
            const timestamp = new Date();
            await addDoc(chatsRef, {
                GuestEmail: selectedGuest,
                landownerEmail: userDetails.email,
                message: newMessage,
                timestamp,
                Sender: 'Landowner',
            });

            const newChatMessage = {
                message: newMessage,
                timestamp,
                Sender: 'Landowner',
            };

            // Append the new message to chatMessages
            setChatMessages([...chatMessages, newChatMessage]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
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
                                Landlord Portal
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
                                    Landlord Portal
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
                                    <h5 className="mb-0">{userDetails ? userDetails.email : 'Landlord'}</h5>
                                    <small className="text-muted">Property Manager</small>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-3">
                            <Link to="/home" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaHome className="me-3" /> Dashboard
                            </Link>
                            <Link to="/PaymentManagement" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaMoneyBillWave className="me-3" /> Payment Management
                            </Link>
                            <Link to="/MaintenanceManagement" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaTools className="me-3" /> Maintenance Management
                            </Link>
                            <Link to="/HousingApplicationManagement" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaFileAlt className="me-3" /> Application Management
                            </Link>
                            <Link to="/add-room" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaBed className="me-3" /> Add Rooms
                            </Link>
                            <Link to="/" className="btn btn-danger w-100 text-start d-flex align-items-center mb-3 p-3">
                                <FaSignOutAlt className="me-3" /> Logout
                            </Link>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <div style={{
                backgroundImage: `url('/Images/landloardhome.jpg')`,
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
                            Landlord Dashboard
                        </h1>
                    </div>

                    <Row className="mb-4">
                        <Col lg={5} className="mb-4 mb-lg-0">
                            <Card className="shadow-lg border-0 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                                <Card.Header className="bg-primary text-white py-3">
                                    <h4 className="mb-0 d-flex align-items-center">
                                        <FaUser className="me-2" /> Welcome, Landlord!
                                    </h4>
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center mb-4">
                                        <div className="bg-light p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                                            <FaUser size={50} className="text-primary" />
                                        </div>
                                        <h4>{userDetails?.email}</h4>
                                        <p className="text-muted mb-0">Property Manager</p>
                                    </div>
                                    
                                    <hr />
                                    
                                    <h5 className="mb-3">Quick Actions</h5>
                                    <hr />
                                    <h5 className="mb-3">Dashboard Overview</h5>
                                    <Row className="g-2">
                                        <Col xs={4}>
                                            <Card className="border-0 bg-light" style={{ borderLeft: '4px solid #0d6efd', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                                <Card.Body className="text-center p-2">
                                                    <h3 className="text-primary mb-0">{activeRooms}</h3>
                                                    <small className="text-muted">Active Rooms</small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={4}>
                                            <Card className="border-0 bg-light" style={{ borderLeft: '4px solid #198754', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                                <Card.Body className="text-center p-2">
                                                    <h3 className="text-success mb-0">{totalApplications}</h3>
                                                    <small className="text-muted">Applications</small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={4}>
                                            <Card className="border-0 bg-light" style={{ borderLeft: '4px solid #ffc107', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                                <Card.Body className="text-center p-2">
                                                    <h3 className="text-warning mb-0">{maintenanceRequests}</h3>
                                                    <small className="text-muted">Maintenance</small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={4}>
                                            <Card className="border-0 bg-light" style={{ borderLeft: '4px solid #17a2b8', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                                <Card.Body className="text-center p-2">
                                                    <h3 className="text-info mb-0">{totalMessages}</h3>
                                                    <small className="text-muted">Messages</small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={4}>
                                            <Card className="border-0 bg-light" style={{ borderLeft: '4px solid #6f42c1', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                                <Card.Body className="text-center p-2">
                                                    <h3 className="text-primary mb-0">{totalRooms}</h3>
                                                    <small className="text-muted">Total Rooms</small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs={4}>
                                            <Card className="border-0 bg-light" style={{ borderLeft: '4px solid #dc3545', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                                <Card.Body className="text-center p-2">
                                                    <h3 className="text-danger mb-0">{pendingPayments}</h3>
                                                    <small className="text-muted">Pending Payments</small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <div className="d-grid gap-2">
                                        <Button variant="outline-primary" className="d-flex align-items-center justify-content-between" onClick={() => navigate('/add-room')}>
                                            <span className="d-flex align-items-center">
                                                <FaBed className="me-2" /> Add New Room
                                            </span>
                                            <span>&rarr;</span>
                                        </Button>
                                        <Button variant="outline-success" className="d-flex align-items-center justify-content-between" onClick={() => navigate('/PaymentManagement')}>
                                            <span className="d-flex align-items-center">
                                                <FaMoneyBillWave className="me-2" /> View Payments
                                            </span>
                                            <span>&rarr;</span>
                                        </Button>
                                        <Button variant="outline-warning" className="d-flex align-items-center justify-content-between" onClick={() => navigate('/MaintenanceManagement')}>
                                            <span className="d-flex align-items-center">
                                                <FaTools className="me-2" /> Maintenance Requests
                                            </span>
                                            <span>&rarr;</span>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col lg={1}></Col>

                        <Col lg={6} className="ml-lg-2">
                            <Card className="shadow-lg border-0 h-100" style={{ borderTop: '4px solid #0d6efd', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                                <Card.Header className="bg-primary text-white py-3">
                                    <h4 className="mb-0 d-flex align-items-center">
                                        <FaEnvelope className="me-2" /> Guest Conversations
                                    </h4>
                                </Card.Header>
                                <Card.Body className="d-flex flex-column" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                            <p className="mt-3">Loading conversations...</p>
                                        </div>
                                    ) : Object.keys(chats).length === 0 ? (
                                        <div className="text-center py-5">
                                            <FaComment size={40} className="text-muted mb-3" />
                                            <h5>No conversations yet</h5>
                                            <p className="text-muted">When guests message you, they'll appear here.</p>
                                        </div>
                                    ) : (
                                        <ListGroup variant="flush">
                                            {Object.keys(chats).map((guestEmail) => {
                                                const messages = chats[guestEmail];
                                                const lastMessage = messages[messages.length - 1];
                                                const unreadCount = messages.filter(msg => msg.Sender !== 'Landowner' && !msg.read).length;
                                                
                                                return (
                                                    <ListGroup.Item 
                                                        key={guestEmail} 
                                                        action 
                                                        onClick={() => handleViewChat(guestEmail)} 
                                                        className="d-flex justify-content-between align-items-center p-3 border-bottom" 
                                                        style={{ 
                                                            cursor: 'pointer',
                                                            background: unreadCount > 0 ? 'rgba(13, 110, 253, 0.05)' : 'inherit'
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3 text-white" style={{ width: '45px', height: '45px', minWidth: '45px' }}>
                                                                <FaUser size={20} />
                                                            </div>
                                                            <div>
                                                                <h6 className="mb-0 d-flex align-items-center">
                                                                    {guestEmail.split('@')[0]}
                                                                    {unreadCount > 0 && (
                                                                        <Badge bg="primary" pill className="ms-2">{unreadCount}</Badge>
                                                                    )}
                                                                </h6>
                                                                <small className="text-muted">
                                                                    {lastMessage?.message?.substring(0, 30)}
                                                                    {lastMessage?.message?.length > 30 ? '...' : ''}
                                                                </small>
                                                                <small className="d-block text-muted">
                                                                    {lastMessage?.timestamp?.toLocaleDateString()} {lastMessage?.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <Button variant="outline-primary" size="sm" className="rounded-pill">
                                                            <FaComment className="me-1" /> Chat
                                                        </Button>
                                                    </ListGroup.Item>
                                                );
                                            })}
                                        </ListGroup>
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
                            <p className="mb-0">Landlord Portal</p>
                            <p className="mb-0">© 2025 Travel Lotus. All rights reserved.</p>
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0">
                            <h5 className="mb-3">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/home" className="text-white text-decoration-none">Dashboard</Link></li>
                                <li><Link to="/PaymentManagement" className="text-white text-decoration-none">Payments</Link></li>
                                <li><Link to="/MaintenanceManagement" className="text-white text-decoration-none">Maintenance</Link></li>
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

            <Modal show={showModal} onHide={() => setShowModal(false)} size="md" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title className="d-flex align-items-center">
                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2 text-primary" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                            <FaUser size={16} />
                        </div>
                        Chat with {selectedGuest}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <div className="chat-container p-3" style={{ height: '350px', overflowY: 'auto' }}>
                        {chatMessages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`d-flex ${msg.Sender === 'Landowner' ? 'justify-content-end' : 'justify-content-start'} mb-3`}
                            >
                                <div 
                                    className={`p-3 rounded-3 ${msg.Sender === 'Landowner' 
                                        ? 'bg-primary text-white' 
                                        : 'bg-light border'}`}
                                    style={{ maxWidth: '75%' }}
                                >
                                    <div className="small mb-1">
                                        <strong>{msg.Sender === 'Landowner' ? 'You' : msg.Sender.split('@')[0]}</strong>
                                        {msg.timestamp && (
                                            <span className={`ms-2 ${msg.Sender === 'Landowner' ? 'text-white-50' : 'text-muted'}`}>
                                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        )}
                                    </div>
                                    <div>{msg.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-top">
                        <Form className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="me-2"
                            />
                            <Button variant="primary" onClick={handleSendMessage}>
                                <FaComment className="me-2" />
                                Send
                            </Button>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>

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

export default LandOwnerHome;