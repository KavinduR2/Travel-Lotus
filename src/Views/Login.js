import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, 'Users', user.uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setSuccess(`Login successful as ${userData.role || 'User'}! Redirecting...`);
            } else {
                setSuccess('Login successful! Redirecting...');
            }
            
            setLoading(false); // Stop loading here
            setTimeout(() => navigate('/home'), 1500);
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid email or password.');
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        setGoogleLoading(true);
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDoc = await getDoc(doc(db, 'Users', user.uid));
            
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'Users', user.uid), {
                    email: user.email,
                    role: 'Guest',
                    createdAt: new Date(),
                });
                setSuccess('First-time Google login successful! Registered as Guest. Redirecting...');
            } else {
                const userData = userDoc.data();
                setSuccess(`Google login successful as ${userData.role || 'User'}! Redirecting...`);
            }
            
            setGoogleLoading(false); // Stop loading here
            setTimeout(() => navigate('/home'), 1500);
        } catch (error) {
            console.error('Error logging in with Google:', error);
            setError('Failed to login with Google.');
            setGoogleLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url('/Images/Login_Image.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <nav className="navbar navbar-expand-lg navbar-dark bg-transparent w-100 position-absolute top-0 start-0 p-4">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <div className="d-flex align-items-center">
                            <h1 className="fs-1 fw-bold mb-0" style={{ 
                                color: 'black', 
                                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.7)',
                                letterSpacing: '1px',
                                position: 'relative',
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                border: '2px solid rgba(0, 105, 217, 0.5)',
                                transform: 'translateY(0)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-5px)';
                                e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                            }}>
                                Travel Lotus
                                <span style={{ 
                                    fontSize: '0.4em', 
                                    display: 'block', 
                                    color: '#0069d9',
                                    fontWeight: 'normal',
                                    letterSpacing: 'normal',
                                    textShadow: 'none',
                                    marginTop: '-5px'
                                }}>
                                    Your Journey, Your Way
                                </span>
                            </h1>
                        </div>
                    </Link>
                </div>
            </nav>
            
            <Container className="d-flex justify-content-center align-items-center">
                <Row className="justify-content-center w-100">
                    <Col md={6} sm={10} lg={5}>
                        <Card className="shadow-lg border-0 rounded-lg" style={{ 
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Card.Body className="p-5">
                                <Card.Title className="text-center mb-4">
                                    <h2 className="fw-bold" style={{ color: '#0069d9' }}>Welcome Back</h2>
                                    <p className="text-muted mt-2">Login to your account</p>
                                </Card.Title>
                                
                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="p-3 rounded-3"
                                            style={{ borderLeft: '4px solid #0069d9' }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Password</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="p-3 rounded-3 rounded-end-0"
                                                style={{ borderLeft: '4px solid #0069d9' }}
                                            />
                                            <Button
                                                variant="light"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="rounded-start-0 rounded-end-3"
                                            >
                                                {showPassword ? '🙈' : '👀'}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 p-3 rounded-3 border-0 shadow-sm mb-3 mt-2"
                                        style={{ 
                                            background: 'linear-gradient(to right, #0069d9, #0056b3)',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease'
                                        }}
                                        disabled={loading || googleLoading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logging in...
                                            </>
                                        ) : 'Login'}
                                    </Button>

                                    <div className="text-center my-3">
                                        <span className="text-muted">or continue with</span>
                                    </div>

                                    <Button
                                        variant="light"
                                        className="w-100 p-3 rounded-3 border shadow-sm mb-4 d-flex align-items-center justify-content-center"
                                        onClick={handleGoogleLogin}
                                        disabled={loading || googleLoading}
                                        style={{ transition: 'all 0.3s ease' }}
                                    >
                                        <FcGoogle size={20} className="me-2" />
                                        {googleLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logging in...
                                            </>
                                        ) : 'Login with Google'}
                                    </Button>

                                    {error && <Alert variant="danger" className="mt-3 mb-3">{error}</Alert>}
                                    {success && <Alert variant="success" className="mt-3 mb-3">{success}</Alert>}

                                    <div className="text-center mt-4">
                                        <span className="text-dark">Don't have an account? </span>
                                        <Link
                                            to="/register"
                                            style={{ 
                                                color: '#0069d9', 
                                                fontWeight: '600', 
                                                textDecoration: 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = '#004c99'}
                                            onMouseLeave={(e) => e.target.style.color = '#0069d9'}
                                        >
                                            Register here
                                        </Link>
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
