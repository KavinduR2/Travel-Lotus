import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
 
const AdminRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Guest');
    const [error, setError] = useState('');
    const navigate = useNavigate();
 
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
 
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
 
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
 
            await setDoc(doc(db, 'Users', user.uid), {
                email: user.email,
                role: role,
                createdAt: new Date(),
            });
 
            alert(`Registration successful as ${role}`);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };
 
    return (
        <div
            style={{
                backgroundImage: `url('/Images/BGImage.png')`, // Reference image in public folder
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff', // White text on the dark background
            }}
        >
            <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
                <div className="container-fluid">
                    <Link className="navbar-brand fs-1 fw-bold" style={{ color: 'black' }} to="/">Travel Lotus</Link>
                </div>
            </nav>
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Row className="justify-content-center w-100">
                    <Col md={6} sm={8} lg={4}>
                        <Card className="shadow-lg border-0 rounded-4">
                            <Card.Body className="p-4">
                                <Card.Title className="text-center mb-4 fs-3 fw-bold">Create Admin Account</Card.Title>
                                <Form onSubmit={handleRegister}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="p-3 border-0 rounded-3"
                                        />
                                    </Form.Group>
 
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="p-3 border-0 rounded-3"
                                        />
                                    </Form.Group>
 
                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="p-3 border-0 rounded-3"
                                        />
                                    </Form.Group>
 
                                    <div className="d-flex mb-3">
                                        <Form.Check
                                            type="radio"
                                            label="Guest"
                                            value="Guest"
                                            checked={role === 'Guest'}
                                            onChange={() => setRole('Guest')}
                                            className="me-3"
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Landlord"
                                            value="Landlord"
                                            checked={role === 'Landlord'}
                                            onChange={() => setRole('Landlord')}
                                        />
                                    </div>
 
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 p-3 rounded-3 border-0 shadow-sm"
                                        style={{ backgroundColor: '#0069d9', fontWeight: '600' }}
                                    >
                                        Register
                                    </Button>
                                </Form>
 
                                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
 
                                <div className="text-center mt-4">
                                    <span className="text-dark">Already have an account?  </span>
                                    <Link
                                        to="/login"
                                        style={{ color: '#0069d9', fontWeight: '600', textDecoration: 'none' }}
                                        onMouseEnter={(e) => e.target.style.color = '#004c99'}  // Change color on hover
                                        onMouseLeave={(e) => e.target.style.color = '#0069d9'}  // Reset color on hover leave
                                    >
                                        Log in here
                                    </Link>.
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
 
export default AdminRegister;
 