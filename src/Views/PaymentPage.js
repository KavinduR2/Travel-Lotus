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