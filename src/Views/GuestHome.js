import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form, ListGroup } from 'react-bootstrap';
 
const GuestHome = () => {
    const [acceptedRooms, setAcceptedRooms] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [show, setShow] = useState(false);
 
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const landownerEmail = "landowner@example.com";
 
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        fetchMessages();
    };
 
    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toISOString().split("T")[0];
    };
 
    // Fetch accepted rooms
    useEffect(() => {
        const fetchAcceptedRooms = async () => {
            if (!user) return;
 
            try {
                const querySnapshot = await getDocs(collection(db, 'housingApplications'));
                const rooms = [];
                querySnapshot.forEach((doc) => {
                    rooms.push({ id: doc.id, ...doc.data() });
                });
 
                setAcceptedRooms(rooms.filter(room => room.email === user.email));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accepted rooms:', error);
                setLoading(false);
            }
        };
 
        fetchAcceptedRooms();
    }, [user?.email]);