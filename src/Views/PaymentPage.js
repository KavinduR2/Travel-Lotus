import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card, Offcanvas, Spinner, Modal } from 'react-bootstrap';
import { FaBars, FaExclamationTriangle, FaUser, FaBed, FaTools, FaSignOutAlt, FaCreditCard } from 'react-icons/fa';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = location.state;
    const user = JSON.parse(sessionStorage.getItem('user'));

    const [showSidebar, setShowSidebar] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleCloseSidebar = () => setShowSidebar(false);

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        billingAddress: '',
        email: user.email,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (
            !formData.cardNumber ||
            !formData.cardName ||
            !formData.expiryDate ||
            !formData.cvv ||
            !formData.billingAddress
        ) {
            alert('Please fill out all fields.');
            return;
        }

        setIsProcessing(true);

        try {
            console.log('Processing payment for room ID:', roomId);
            console.log('Payment details:', formData);

            // Update room application status to Paid
            const roomRef = doc(db, 'housingApplications', roomId);

            // Save payment data in Firestore
            const paymentData = {
                roomId,
                email: formData.email,
                cardName: formData.cardName,
                billingAddress: formData.billingAddress,
                paymentDate: new Date().toISOString(),
                paymentAmount: '9000', // Example amount.
            };
            console.log(paymentData);

            await addDoc(collection(db, 'payments'), paymentData);
            await updateDoc(roomRef, { application: 'Paid' });
            
            setPaymentSuccess(true);
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Navigation Bar */}
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

            {/* Payment Page Content */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                <div
                    style={{
                        backgroundImage: `url('/Images/payment.jpg')`,
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
                    
                    <Container className="mt-5">
                        <div className="text-center mb-4">
                            <h1 className="display-5 fw-bold" style={{ 
                                color: 'white', 
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                                background: 'rgba(0, 0, 0, 0.5)',
                                padding: '12px 25px',
                                borderRadius: '10px',
                                display: 'inline-block'
                            }}>
                                Secure Payment
                            </h1>
                        </div>
                        
                        <Row className="justify-content-center">
                            <Col md={8} lg={6}>
                                <Card className="shadow-lg border-0 rounded-lg" style={{ 
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <Card.Header className="bg-primary text-white p-3 d-flex align-items-center">
                                        <FaCreditCard className="me-2" size={20} />
                                        <h4 className="mb-0">Payment Details</h4>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        {paymentSuccess ? (
                                            <div className="text-center py-5">
                                                <div className="mb-4" style={{ color: '#28a745' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                                    </svg>
                                                </div>
                                                <h3 className="text-success mb-3">Payment Successful!</h3>
                                                <p className="lead">Your application status is now Paid.</p>
                                                <p>Redirecting to dashboard in a few seconds...</p>
                                                <div className="mt-3">
                                                    <Spinner animation="border" variant="primary" />
                                                </div>
                                            </div>
                                        ) : (
                                            <Form onSubmit={handlePayment}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Card Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="cardNumber"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="1234 5678 9012 3456"
                                                        required
                                                        className="shadow-sm"
                                                    />
                                                </Form.Group>
                                
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Cardholder Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="cardName"
                                                        value={formData.cardName}
                                                        onChange={handleInputChange}
                                                        placeholder="John Doe"
                                                        required
                                                        className="shadow-sm"
                                                    />
                                                </Form.Group>
                                
                                                <Row className="mb-3">
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label>Expiry Date</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="expiryDate"
                                                                value={formData.expiryDate}
                                                                onChange={handleInputChange}
                                                                placeholder="MM/YY"
                                                                required
                                                                className="shadow-sm"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group>
                                                            <Form.Label>CVV</Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                name="cvv"
                                                                value={formData.cvv}
                                                                onChange={handleInputChange}
                                                                placeholder="123"
                                                                required
                                                                className="shadow-sm"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                
                                                <Form.Group className="mb-4">
                                                    <Form.Label>Billing Address</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        name="billingAddress"
                                                        value={formData.billingAddress}
                                                        onChange={handleInputChange}
                                                        placeholder="123 Main St, City, Country"
                                                        required
                                                        className="shadow-sm"
                                                        style={{ height: '100px' }}
                                                    />
                                                </Form.Group>

                                                <div className="d-flex justify-content-between mb-3 pt-2">
                                                    <h5 className="mb-0">Total Amount:</h5>
                                                    <h5 className="mb-0">$9,000.00</h5>
                                                </div>

                                                <div className="d-flex justify-content-between">
                                                    <Button
                                                        type="button"
                                                        variant="outline-danger"
                                                        onClick={() => navigate('/home')}
                                                        className="px-4"
                                                        disabled={isProcessing}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button 
                                                        type="submit" 
                                                        variant="primary" 
                                                        className="px-4"
                                                        disabled={isProcessing}
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <Spinner
                                                                    as="span"
                                                                    animation="border"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                    className="me-2"
                                                                />
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            'Confirm Payment'
                                                        )}
                                                    </Button>
                                                </div>
                                            </Form>
                                        )}
                                    </Card.Body>
                                    <Card.Footer className="bg-light p-3 text-center">
                                        <small className="text-muted">
                                            Your payment information is securely processed and encrypted
                                        </small>
                                    </Card.Footer>
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

export default PaymentPage;