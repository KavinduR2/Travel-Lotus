import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';

const AdminRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Show password toggle
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleAdminRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user data in Firestore with role 'Landlord'
            await setDoc(doc(db, 'Users', user.uid), {
                email: user.email,
                role: 'Landlord', // Default role for admin registration
                createdAt: new Date(),
            });

            // Show success message and redirect to login
            setSuccess('Registration successful as Landlord! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
        } catch (err) {
            console.error('Error during admin registration:', err);
            setError(err.message);
        }
    };

    const handleGoogleRegister = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Store user data in Firestore with role 'Landlord'
            await setDoc(doc(db, 'Users', user.uid), {
                email: user.email,
                role: 'Landlord', // Explicitly set role to Landlord for Google Sign-In
                createdAt: new Date(),
            });

            // Show success message and redirect to login
            setSuccess('Google registration successful as Landlord! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
        } catch (err) {
            console.error('Error during Google registration:', err);
            setError('Failed to register with Google.');
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url('/Images/BGImage.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
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
                                <Card.Title className="text-center mb-4 fs-3 fw-bold">Register as Landlord</Card.Title>
                                <Form onSubmit={handleAdminRegister}>
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
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="p-3 border-0 rounded-3"
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="border-0"
                                            >
                                                {showPassword ? '🙈' : '👀'}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Confirm your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="p-3 border-0 rounded-3"
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="border-0"
                                            >
                                                {showPassword ? '🙈' : '👀'}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 p-3 rounded-3 border-0 shadow-sm mb-3"
                                        style={{ backgroundColor: '#0069d9', fontWeight: '600' }}
                                    >
                                        Register as Landlord
                                    </Button>

                                    <Button
                                        variant="outline-dark"
                                        className="w-100 p-3 rounded-3 border-1 shadow-sm mb-3 d-flex align-items-center justify-content-center"
                                        onClick={handleGoogleRegister}
                                    >
                                        <FcGoogle size={20} className="me-2" />
                                        Register with Google
                                    </Button>

                                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                                    {success && <Alert variant="success" className="mt-3">{success}</Alert>}

                                    <div className="text-center mt-4">
                                        <span className="text-dark">Already have an account?  </span>
                                        <Link
                                            to="/login"
                                            style={{ color: '#0069d9', fontWeight: '600', textDecoration: 'none' }}
                                            onMouseEnter={(e) => e.target.style.color = '#004c99'}
                                            onMouseLeave={(e) => e.target.style.color = '#0069d9'}
                                        >
                                            Log in here
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

export default AdminRegister;
