import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const ContactUs = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/Home">Travel Lotus</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/Home" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item" style={{backgroundColor:'green',borderRadius:'15px'}}>
                                <Button variant="link" className="nav-link" style={{color:'white'}} onClick={handleShow}>Emergency Call</Button>
                            </li>
                            {/* <li className="nav-item">
                                <Link to="/login" className="nav-link">Login</Link>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Contact Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Us</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <p>Sri Lankan Police: 119</p>
                    <p>Ambulance        : 1990</p>
                
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Contact Section */}
            <Container className="my-5">
                <h2 className="text-center mb-4">Send Us a Message</h2>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter your name" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder="Your message" />
                            </Form.Group>
                            <Button variant="primary" type="submit">Send Message</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer className="bg-light text-center py-3">
                <Container>
                    <p>&copy; 2025 TRAVEL LOTUS. All rights reserved.</p>
                    <p><Link to="/privacy">Privacy Policy</Link></p>
                </Container>
            </footer>
        </>
    );
};

export default ContactUs;
