import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, ListGroup } from 'react-bootstrap';
 
const GuestHome = () => {
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
    }, [user?.email]);

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
    }, []);
 
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
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">Travel Lotus</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item" style={{backgroundColor:'green',borderRadius:'8px',marginRight:'10px'}}>
                                <Link to="/contact" className="nav-link" style={{color:'white'}} >Emergency</Link>
                            </li>
                            <li className="nav-item">
                                <Button style={{ marginRight: 10 }} variant="primary" onClick={handleShow}>
                                    Chat
                                </Button>
                            </li>
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
                    backgroundImage: `url('/Images/GuestHome.webp')`, // Reference image in public folder
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    //justifyContent: 'center',
                    alignItems: 'center',
                    // color: '#fff',
                    // backgroundColor: '#fff'
                }}>

                <Container className="mt-5">
                    <Offcanvas show={show} onHide={handleClose} placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Chat with Landlord</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {chatLoading ? (
                                <Spinner animation="border" variant="primary" />
                            ) : (
                                <ListGroup>
                                    {messages.map((msg, index) => (
                                        <ListGroup.Item key={index} className={msg.Sender === user.email ? "text-start" : "text-end"}>
                                            <strong>{msg.Sender === user.email ? "You" : "Landowner"}:</strong> {msg.message}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}

                            <Form.Group className="mt-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button className="mt-2" onClick={sendMessage} variant="primary">
                                    Send
                                </Button>
                            </Form.Group>
                        </Offcanvas.Body>
                    </Offcanvas>
                    <h2 className="text-center mb-4" style={{ color: 'white' }}>Guest Dashboard</h2>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <div className="mt-4 text-center">
                                        <h5>Welcome, {user ? user.email : 'Guest'}!</h5>
                                    </div>

                                    <div className="mt-4">
                                        <h4>Your Rooms</h4>
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
                                                    <li key={room.id} className="list-group-item">
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
                                    </div>

                                    <div className="mt-4">
                                        <h4>All Maintenance Requests</h4>
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
                                                    <li key={request.id} className="list-group-item">
                                                        <div><strong>Room Number:</strong> {request.roomNumber}</div>
                                                        <div><strong>Submission Date:</strong> {formatDate(request.submissionDate)}</div>
                                                        <div><strong>Status:</strong> {request.status || 'Pending'}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

            </div>
        </>
    );
};

export default GuestHome;
      