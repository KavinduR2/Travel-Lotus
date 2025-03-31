import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaLinkedin, FaEnvelope, FaPhone, FaArrowLeft, FaGithub, FaCode } from 'react-icons/fa';

const Developers = () => {
  const developers = [
    {
      name: 'Y.A.D.K.R. Wijayarathna',
      education: 'BEng. Software Engineering',
      institute: 'Informatics Institute of Technology (IIT) Sri Lanka in collaboration with the University of Westminster',
      linkedin: 'www.linkedin.com/in/kavindu-rasanjana-55a0122a3',
      email: 'Kavindu7666@gmail.com',
      phone: '+94716334498',
      image: 'kavindu.jpg',
      role: 'Full Stack Developer',
      quote: 'Building tomorrow\'s solutions today',
      gradient: 'linear-gradient(135deg, #614385, #516395)'
    },
    {
      name: 'A. A. D. S. I. Amarasinghe',
      education: 'BEng. Software Engineering',
      institute: 'Informatics Institute of Technology (IIT) Sri Lanka in collaboration with the University of Westminster',
      email: 'shehanamerasinghe6@gmail.com',
      phone: '+94 78 834 6803',
      image: 'shehan.jpg',
      role: 'Backend Developer',
      quote: 'Coding with passion and purpose',
      gradient: 'linear-gradient(135deg, #1A2980, #26D0CE)'
    },
    {
      name: 'Kajananan Nantheeswaran',
      education: 'BEng. Software Engineering',
      institute: 'Informatics Institute of Technology (IIT) Sri Lanka in collaboration with the University of Westminster',
      email: 'nkajananan2001@gmail.com',
      phone: '+94 76 132 3580',
      image: 'kajananan.jpg',
      role: 'Frontend Developer',
      quote: 'Creating experiences that inspire',
      gradient: 'linear-gradient(135deg, #3A1C71, #D76D77, #FFAF7B)'
    },
    {
      name: 'Dulina Shenal Samarasena',
      education: 'BEng. Software Engineering',
      institute: 'Informatics Institute of Technology (IIT) Sri Lanka in collaboration with the University of Westminster',
      email: 'Shenalsamarasena443@gmail.com',
      phone: '+94 76 164 7727',
      image: 'dulina.jpg', 
      role: 'UI/UX Developer',
      quote: 'Designing the bridge between users and technology',
      gradient: 'linear-gradient(135deg, #4B79A1, #283E51)'
    }
  ];

  // Array of skills with gradient colors
  const skills = [
    { name: 'React', gradient: 'linear-gradient(135deg, #48c6ef, #6f86d6)', icon: <FaCode /> },
    { name: 'Node.js', gradient: 'linear-gradient(135deg, #56ab2f, #a8e063)', icon: <FaCode /> },
    { name: 'Firebase', gradient: 'linear-gradient(135deg, #ff8008, #ffc837)', icon: <FaCode /> },
    { name: 'Bootstrap', gradient: 'linear-gradient(135deg, #834d9b, #d04ed6)', icon: <FaCode /> },
    { name: 'UI/UX Design', gradient: 'linear-gradient(135deg, #36d1dc, #5b86e5)', icon: <FaCode /> },
    { name: 'RESTful APIs', gradient: 'linear-gradient(135deg, #cb356b, #bd3f32)', icon: <FaCode /> },
  ];

  return (
    <>
      {/* Header - Black */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black">
        <div className="container">
          <Link className="navbar-brand fs-2 fw-bold d-flex align-items-center" to="/">
            <img 
              src="/images/logo.png" 
              alt="Travel Lotus Logo" 
              height="80" 
              className="me-2" 
            />
            <span style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>TRAVEL LOTUS</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Gray */}
      <div className="position-relative overflow-hidden" style={{
        background: 'url("/images/team-hero-bg.jpg") no-repeat center center',
        backgroundSize: 'cover',
        height: '40vh',
        backgroundAttachment: 'fixed'
      }}>
        <div className="position-absolute w-100 h-100" style={{backgroundColor: 'rgba(0,0,0,0.6)'}}></div>
        <Container className="position-relative h-100 d-flex flex-column justify-content-center align-items-center text-white text-center">
          <h1 className="display-4 fw-bold mb-3" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.8)'}}>
            <FaUsers className="me-3" />
            Meet Our Developers
          </h1>
          <p className="lead col-md-8 mx-auto mb-4" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.8)'}}>
            Undergraduate Software Engineering students from Informatics Institute of Technology (IIT) Sri Lanka in collaboration with the University of Westminster united by our passion for creating innovative travel solutions.
          </p>
          <Link to="/">
            <Button variant="light" className="px-4 py-2 rounded-pill shadow">
              <FaArrowLeft className="me-2" />
              Back to Home
            </Button>
          </Link>
        </Container>
      </div>

      {/* Developers Cards Section - Light Gray Background */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '2rem 0' }}>
        <Container>
          <Row className="justify-content-center g-4">
            {developers.map((developer, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="border-0 h-100 shadow rounded-lg overflow-hidden" 
                  style={{
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Profile Photo Section */}
                  <div 
                    className="position-relative" 
                    style={{
                      background: developer.gradient,
                      height: '150px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      paddingBottom: '10px'
                    }}
                  >
                    <img 
                      src={`/images/developers/${developer.image}`} 
                      alt={developer.name} 
                      className="rounded-circle img-fluid border-3"
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        objectFit: 'cover', 
                        border: '5px solid white',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                  <Card.Body className="text-center pt-4">
                    <div className="mb-4">
                      <Card.Title className="fw-bold fs-4" style={{ whiteSpace: 'normal', overflow: 'visible' }}>
                        {developer.name}
                      </Card.Title>
                      <div className="badge bg-primary mb-2">{developer.role}</div>
                      <Card.Text className="mb-1 text-muted">{developer.education}</Card.Text>
                      <Card.Text className="small text-muted">
                        <div>Informatics Institute of Technology (IIT)</div>
                        <div>Sri Lanka</div>
                        <div>in collaboration with the</div>
                        <div>University of Westminster</div>
                        <div>United Kingdom</div>
                      </Card.Text>
                    </div>
                    
                    <blockquote className="blockquote mb-4">
                      <p className="small fst-italic">"{developer.quote}"</p>
                    </blockquote>
                    
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      <Button variant="outline-primary" size="sm" href={`mailto:${developer.email}`} className="rounded-pill">
                        <FaEnvelope className="me-1" /> Email
                      </Button>
                      <Button variant="outline-success" size="sm" href={`tel:${developer.phone}`} className="rounded-pill">
                        <FaPhone className="me-1" /> Call
                      </Button>
                    </div>
                    
                    <div className="d-flex justify-content-center gap-2">
                      {developer.linkedin && (
                        <Button 
                          variant="outline-primary" 
                          href={`https://${developer.linkedin}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon rounded-circle"
                          style={{width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        >
                          <FaLinkedin />
                        </Button>
                      )}
                      <Button 
                        variant="outline-dark" 
                        className="btn-icon rounded-circle"
                        style={{width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      >
                        <FaGithub />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        className="btn-icon rounded-circle"
                        style={{width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      >
                        <FaCode />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Skills Section - Light Gray Background */}
      <div className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <h2 className="text-center mb-5 fw-bold">Our Collective Expertise</h2>
          <Row className="g-4 justify-content-center">
            {skills.map((skill, index) => (
              <Col key={index} xs={6} md={3}>
                <div 
                  className="rounded-3 shadow p-4 text-center h-100 d-flex flex-column justify-content-center align-items-center"
                  style={{
                    transition: 'all 0.3s ease',
                    background: skill.gradient,
                    color: 'white'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div className="skill-icon mb-3">
                    <div className="rounded-circle bg-white p-3 d-inline-block">
                      {React.cloneElement(skill.icon, { className: "text-primary", style: {fontSize: '24px'} })}
                    </div>
                  </div>
                  <h5 className="mb-0">{skill.name}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Footer - Black */}
      <footer className="bg-black text-white py-4">
        <Container>
          <Row className="py-5 text-white">
            <Col md={6} className="mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">TRAVEL LOTUS</h5>
              <p>Discover the world with our innovative travel solutions, designed to make your journeys unforgettable.</p>
            </Col>
            <Col md={6}>
              <h5 className="fw-bold mb-3">Contact</h5>
              <p className="mb-1">Email: TravelLotuscc@gmail.com</p>
              <p className="mb-0">FaceBook: Travel Lotus</p>
            </Col>
          </Row>
          <div className="border-top border-white border-opacity-25 py-4 text-center text-white">
            <p className="mb-0">&copy; 2025 TRAVEL LOTUS. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Developers;