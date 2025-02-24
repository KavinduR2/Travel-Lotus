import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};

            sessionStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                role: userData.role || 'user',
            }));

            navigate('/home');
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid email or password.');
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url('/Images/Login_Image.webp')`, // Reference image in public folder
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
                                <Card.Title className="text-center mb-4 fs-1 fw-bold">Login</Card.Title>
                                <Form onSubmit={handleLogin}>
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

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 p-3 rounded-3 border-0 shadow-sm"
                                        style={{ backgroundColor: '#0069d9', fontWeight: '600' }}
                                    >
                                        Login
                                    </Button>

                                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                    <div className="text-center mt-4">
                                        <span className="text-dark">Don't have an account?  </span>
                                        <Link
                                            to="/register"
                                            style={{ color: '#0069d9', fontWeight: '600', textDecoration: 'none' }}
                                            onMouseEnter={(e) => e.target.style.color = '#004c99'}  // Change color on hover
                                            onMouseLeave={(e) => e.target.style.color = '#0069d9'}  // Reset color on hover leave
                                        >
                                            Register here
                                        </Link>.
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
