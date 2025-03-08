import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Modal, Form } from 'react-bootstrap';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const LandOwnerHome = ({ userDetails }) => {
    const [chats, setChats] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
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

    const handleViewChat = (GuestEmail) => {
        setSelectedGuest(GuestEmail);

        // No need to sort as they are fetched in ascending order
        setChatMessages([...chats[GuestEmail]]);
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
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Container className="mt-5">
                <h2 className="text-center mb-4">Landlord Dashboard</h2>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                {/* <Card.Title className="text-center"></Card.Title> */}
                                <div className="mt-4 text-center">
                                    <h5>Welcome, {userDetails.email}!</h5>
                                    <p>Your details:</p>
                                    <ul className="list-group text-left">
                                        <li className="list-group-item"><strong>Email:</strong> {userDetails.email}</li>
                                        {/* <li className="list-group-item"><strong>UID:</strong> {userDetails.uid}</li> */}
                                    </ul>
                                </div>

                                <h5 className="mt-4">Chats with Guest</h5>
                                {loading ? (
                                    <Spinner animation="border" />
                                ) : (
                                    <ListGroup>
                                        {Object.keys(chats).map((GuestEmail) => (
                                            <ListGroup.Item key={GuestEmail}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span>{GuestEmail}</span>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => handleViewChat(GuestEmail)}
                                                    >
                                                        View Chat
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chat with {selectedGuest}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="chat-container">
                        <ListGroup>
                            {chatMessages.map((msg, index) => (
                                <ListGroup.Item key={index} className={msg.Sender === 'Landowner' ? 'text-end' : 'text-start'}>
                                    <strong>{msg.Sender === 'Landowner' ? 'You' : msg.Sender}:</strong> {msg.message}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                    <Form className="mt-3">
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                        </Form.Group>
                        <Button className="mt-2" variant="primary" onClick={handleSendMessage}>
                            Send
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LandOwnerHome;