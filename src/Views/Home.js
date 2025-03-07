// Calling Functions

import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import GuestHome from './GuestHome'; // Import Guest component
import LandOwnerHome from './LandOwnerHome';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const Home = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            navigate('/login');
        } else {
            setUserDetails(user);
            const getRole = async () => {
                try {
                    const userRef = doc(db, 'Users', user.uid);
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        setUserRole(docSnap.data().role);
                    } else {
                        console.log("No such document!");
                        setUserRole('No role assigned');
                    }
                } catch (error) {
                    console.error("Error fetching user role: ", error);
                }
            };
            getRole();
        }
    }, [navigate]);

    if (!userDetails) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (userRole === 'Landlord') {
        return <LandOwnerHome userDetails={userDetails} />;
    } else if (userRole === 'Guest') {
        return <GuestHome userDetails={userDetails} />;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Welcome, {userDetails.email}!</Card.Title>
                            <Card.Text>
                                Role: {userRole ? userRole : 'No role assigned'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;