import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaBed, FaBuilding, FaHandshake, FaArrowRight } from "react-icons/fa";

const LandingPage = () => {
    return (
        <>
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Travel Lotus</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                    
                            {/* <li className="nav-item">
                                <Link to="/contact" className="nav-link">Contact</Link>
                            </li> */}
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="hero bg-primary text-white text-center py-5">
                <Container>
                    <h1>Find Your Perfect Stay</h1>
                    <p className="lead">Affordable, comfortable, and convenient Guest housing.</p>
                    <Link to="/login">
                        <Button variant="light" size="lg">
                            Explore Rooms <FaArrowRight />
                        </Button>
                    </Link>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="my-5">
                <h2 className="text-center mb-4">Why Choose Travel Lotus?</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="text-center">
                            <Card.Body>
                                <FaBed size={50} className="mb-3 text-primary" />
                                <Card.Title>Comfortable Rooms</Card.Title>
                                <Card.Text>Choose from a variety of well-furnished rooms.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="text-center">
                            <Card.Body>
                                <FaBuilding size={50} className="mb-3 text-primary" />
                                <Card.Title>Prime Locations</Card.Title>
                                <Card.Text>Stay near campus with easy access to amenities.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="text-center">
                            <Card.Body>
                                <FaHandshake size={50} className="mb-3 text-primary" />
                                <Card.Title>Easy Booking</Card.Title>
                                <Card.Text>Apply online and get instant confirmation.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Call-to-Action Section */}
            <div className="cta bg-dark text-white text-center py-4">
                <Container>
                    <h3>Ready to Book Your Room?</h3>
                    <Link to="/login">
                        <Button variant="success" size="lg">
                            Apply Now
                        </Button>
                    </Link>
                </Container>
            </div>

            {/* Footer */}
            <footer className="bg-light text-center py-3">
                <Container>
                    <p>&copy; 2025 TRAVEL LOTUS. All rights reserved.</p>
                    <p><Link to="/contact">Contact Us</Link> | <Link to="/privacy">Privacy Policy</Link></p>
                </Container>
            </footer>
        </>
    );
};

export default LandingPage;
