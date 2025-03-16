import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaComment, FaExclamationTriangle, FaUser, FaBed, FaTools, FaSignOutAlt } from 'react-icons/fa';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner,ListGroup, Modal } from 'react-bootstrap';

const RequestMaintenance = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [show, setShow] = useState(false);
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  
  const [formData, setFormData] = useState({
    roomNumber: "",
    fullName: "",
    mobile: "",
    reason: "",
    State: "Pending"
  });

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
      setShow(true);
      fetchMessages();
  };
  
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

  // Load user data from sessionStorage more carefully
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Get the raw data from sessionStorage
        const userData = sessionStorage.getItem('user');
        console.log("Raw user data:", userData);
        
        // Only parse if it exists
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log("Parsed user data:", parsedUser);
          setUser(parsedUser);
          
          // Update form data with user email if available
          if (parsedUser && parsedUser.email) {
            setFormData(prev => ({
              ...prev,
              fullName: parsedUser.email
            }));
          }
        } else {
          console.log("No user data found in sessionStorage");
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
      setIsLoading(false);
    };

    // Small delay to ensure sessionStorage is available
    setTimeout(loadUserData, 100);
  }, []);

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, "Rooms");
        const roomSnapshot = await getDocs(roomsCollection);
        const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomList);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const formDataWithDate = {
        ...formData,
        submissionDate: currentDate,
      };

      await addDoc(collection(db, "maintenanceRequests"), formDataWithDate);
      alert("Maintenance request submitted successfully!");

      setFormData({
        roomNumber: "",
        fullName: user?.email || "",
        mobile: "",
        reason: "",
        State: "Pending"
      });
      
      // Navigate back to home after successful submission
      navigate('/home');
    } catch (error) {
      console.error("Error submitting maintenance request:", error);
      alert("Failed to submit the maintenance request. Please try again.");
    }
  };

  const handleLogin = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading user data...</p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center">
                <Alert variant="warning">
                  You need to be logged in to request maintenance.
                </Alert>
                <p>Your session may have expired or you're not logged in properly.</p>
                <Button onClick={handleLogin} variant="primary">
                  Go to Login
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

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
        backgroundImage: `url('/Images/maintance.jpg')`,
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
        <Container className="mt-5">
            <div className="text-center mb-4">
                <h1 className="display-5 fw-bold" style={{ 
                    color: 'white', 
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '12px 25px',
                    borderRadius: '10px',
                    display: 'inline-block'
                }}>
                    Maintenance Request Form
                </h1>
            </div>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow-lg border-0 rounded-lg" style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Card.Header className="bg-primary text-white p-3">
                            <h4 className="mb-0">Submit a Maintenance Request</h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                          <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                              <Form.Label>Room Number</Form.Label>
                              <Form.Select
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select Room</option>
                                {rooms.map((room) => (
                                  <option key={room.id} value={`${room.Floor} - Room ${room.RoomNo}`}>
                                    {`${room.Floor} - Room No : ${room.RoomNo}`}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter Full Name"
                                required
                              />
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Mobile</Form.Label>
                              <Form.Control
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter Mobile Number"
                                required
                              />
                            </Form.Group>

                            <Form.Group className="mb-3">
                              <Form.Label>Reason</Form.Label>
                              <Form.Control
                                as="textarea"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Enter Reason for Maintenance"
                                rows="4"
                                required
                              />
                            </Form.Group>

                            <Button type="submit" variant="primary" className="w-100">
                              Submit
                            </Button>
                          </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
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

export default RequestMaintenance;