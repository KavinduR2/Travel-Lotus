import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaBed, FaBuilding, FaHandshake, FaRobot } from 'react-icons/fa';
import LanguageSelector from './components/LanguageSelector';
import TransportationLinks from './components/TransportationLinks';
import ChatAssistant from './components/ChatAssistant';

const LandingPage = () => {
  const [language, setLanguage] = useState('english');
  const [content, setContent] = useState({
    brandName: 'TRAVEL LOTUS',
    tagline: 'Find Your Perfect Stay',
    description: 'Affordable, comfortable, and convenient Guest housing.',
    exploreButton: 'Explore Rooms',
    features: {
      rooms: 'Comfortable Rooms',
      roomsDesc: 'Choose from a variety of well-furnished rooms.',
      locations: 'Prime Locations',
      locationsDesc: 'Stay near campus with easy access to amenities.',
      booking: 'Easy Booking',
      bookingDesc: 'Apply online and get instant confirmation.',
    },
    transportation: 'Need more help with Transportation?',
    chatbot: 'Chat with Lotus Assistant',
    login: 'Login / Register',
    footer: {
      rights: 'All rights reserved.',
      contact: 'Contact Us',
      privacy: 'Privacy Policy',
    },
  });
  const [showChatbot, setShowChatbot] = useState(false);

  const handleLanguageChange = (languageCode, languageContent) => {
    setLanguage(languageCode);
    setContent(languageContent);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fs-2 fw-bold" to="/">
            {content.brandName}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item me-2">
                <LanguageSelector
                  currentLanguage={language}
                  onChange={handleLanguageChange}
                />
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  <button className="btn btn-warning text-dark fw-bold px-3 py-2">
                    {content.login}
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero bg-primary text-white text-center py-5">
        <Container>
          <h1 className="display-2 fw-bold mb-4">{content.brandName}</h1>
          <h2>{content.tagline}</h2>
          <p className="lead">{content.description}</p>
          <Link to="/login">
            <Button variant="light" size="lg">
              {content.exploreButton}
            </Button>
          </Link>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="my-5">
        <Row>
          <Col md={4} className="mb-4">
            <Card className="text-center h-100">
              <Card.Body>
                <FaBed size={50} className="mb-3 text-primary" />
                <Card.Title>{content.features.rooms}</Card.Title>
                <Card.Text>{content.features.roomsDesc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center h-100">
              <Card.Body>
                <FaBuilding size={50} className="mb-3 text-primary" />
                <Card.Title>{content.features.locations}</Card.Title>
                <Card.Text>{content.features.locationsDesc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="text-center h-100">
              <Card.Body>
                <FaHandshake size={50} className="mb-3 text-primary" />
                <Card.Title>{content.features.booking}</Card.Title>
                <Card.Text>{content.features.bookingDesc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Transportation and Chatbot Section */}
      <div className="bg-light py-4 mb-4">
        <Container>
          <Row className="justify-content-between">
            <Col md={7} className="mb-4 mb-md-0">
              <TransportationLinks title={content.transportation} />
            </Col>
            <Col md={4} className="mb-4">
                <Card className="text-center h-100 shadow-sm">
                    <Card.Body>
                    <FaRobot size={50} className="mb-3 text-primary" />
                    <Card.Title>{content.chatbot}</Card.Title>
                    <Button
                        variant="primary"
                        onClick={() => setShowChatbot(true)}
                        className="w-100"
                        style={{
                        background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
                        border: 'none',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '25px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                        }}
                    >
                        <FaRobot className="me-2" /> {content.chatbot}
                    </Button>
                    </Card.Body>
                </Card>
                </Col>
          </Row>
        </Container>
      </div>

      {/* Chatbot Popup */}
      {showChatbot && (
        <ChatAssistant onClose={() => setShowChatbot(false)} />
      )}

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        <Container>
          <p>&copy; 2025 {content.brandName}. {content.footer.rights}</p>
          <p>
            <Link to="/contact" className="text-light">{content.footer.contact}</Link> |
            <Link to="/privacy" className="text-light"> {content.footer.privacy}</Link>
          </p>
        </Container>
      </footer>
    </>
  );
};

export default LandingPage;
