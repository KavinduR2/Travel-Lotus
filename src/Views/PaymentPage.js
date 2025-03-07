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