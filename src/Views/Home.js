import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import GuestHome from './GuestHome';
import LandOwnerHome from './LandOwnerHome';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';

const Home = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Use onAuthStateChanged to properly detect authentication state
                const unsubscribe = auth.onAuthStateChanged(async (user) => {
                    if (!user) {
                        navigate('/login');
                        return;
                    }
                    
                    setUserDetails(user);
                    
                    try {
                        const userRef = doc(db, 'Users', user.uid);
                        const docSnap = await getDoc(userRef);
                        
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            setUserRole(userData.role);
                            console.log("User role found:", userData.role);
                            // Stop loading as soon as we have the role
                            setLoading(false);
                        } else {
                            console.log("No user document found. Creating default record...");
                            // Create a default record if none exists - don't await this
                            setDoc(userRef, {
                                email: user.email,
                                role: 'Guest', // Default role
                                createdAt: new Date(),
                            })
                            .catch(createError => {
                                console.error("Error creating default user record:", createError);
                            });
                            
                            // Set role and stop loading immediately
                            setUserRole('Guest');
                            setLoading(false);
                        }
                    } catch (docError) {
                        console.error("Error fetching user role:", docError);
                        setError("Failed to load user profile. Please refresh the page.");
                        setLoading(false);
                    }
                });
                
                // Clean up subscription
                return () => unsubscribe();
            } catch (err) {
                console.error("Authentication error:", err);
                setError("Authentication error. Please log in again.");
                setLoading(false);
            }
        };
        
        checkAuth();
    }, [navigate]);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
            setError("Failed to sign out. Please try again.");
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p className="mt-3">Loading your profile...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
                <Button 
                    variant="primary" 
                    onClick={() => navigate('/login')}
                >
                    Return to Login
                </Button>
            </Container>
        );
    }

    // Role-based rendering
    if (userRole === 'Landlord') {
        return <LandOwnerHome userDetails={userDetails} />;
    } else if (userRole === 'Guest') {
        return <GuestHome userDetails={userDetails} />;
    }

    // Fallback UI if role doesn't match expected values
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Welcome, {userDetails?.email || "User"}!</Card.Title>
                            <Card.Text>
                                Role: {userRole || 'No role assigned'}
                            </Card.Text>
                            <Card.Text className="text-muted">
                                If this is incorrect, please contact support.
                            </Card.Text>
                            <Button 
                                variant="primary" 
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
