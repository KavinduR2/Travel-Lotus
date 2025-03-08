import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = location.state;
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);


    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        billingAddress: '',
        email: user.email,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (
            !formData.cardNumber ||
            !formData.cardName ||
            !formData.expiryDate ||
            !formData.cvv ||
            !formData.billingAddress
        ) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            console.log('Processing payment for room ID:', roomId);
            console.log('Payment details:', formData);

            // Update room application status to Paid
            const roomRef = doc(db, 'housingApplications', roomId);


            // Save payment data in Firestore
            const paymentData = {
                roomId,
                email: formData.email,
                cardName: formData.cardName,
                billingAddress: formData.billingAddress,
                paymentDate: new Date().toISOString(),
                paymentAmount: '9000', // Example amount.
            };
            console.log(paymentData);

            await addDoc(collection(db, 'payments'), paymentData);
            await updateDoc(roomRef, { application: 'Paid' });
            alert('Payment successful! Your application status is now Paid.');
            navigate('/home');
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
        }
    };
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">Travel Lotus</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/home" className="nav-link">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/rooms" className="nav-link">Rooms</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/RequestMaintenance" className="nav-link">Request Maintenance</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>