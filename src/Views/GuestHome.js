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

    // Fetch maintenance requests
    useEffect(() => {
        const fetchAllMaintenanceRequests = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'maintenanceRequests'));
                const records = [];
                querySnapshot.forEach((doc) => {
                    records.push({ id: doc.id, ...doc.data() });
                });
 
                setMaintenanceRequests(records.filter(records => records.fullName === user.email));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching maintenance requests:', error);
                setLoading(false);
            }
        };
 
        fetchAllMaintenanceRequests();
    }, []);
 
    // Fetch messages
    const fetchMessages = async () => {
        setChatLoading(true);
        try {
            const q = query(
                collection(db, 'chats'),
                where('GuestEmail', '==', user.email)
            );
 
            const querySnapshot = await getDocs(q);
            const chats = [];
            querySnapshot.forEach((doc) => {
                chats.push(doc.data());
            });
 
            // Sort messages in ascending order based on timestamp
            const sortedChats = sortMessagesByTimestamp(chats);
 
            setMessages(sortedChats);
            setChatLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setChatLoading(false);
        }
    };
 
    // Function to sort messages by timestamp in ascending order
    const sortMessagesByTimestamp = (messages) => {
        return messages.sort((a, b) => a.timestamp - b.timestamp);
    };
 
    // Send a new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
 
        try {
            const newMessageData = {
                GuestEmail: user.email,
                landownerEmail,
                message: newMessage.trim(),
                timestamp: new Date(),
                Sender: user.email,
            };
 
            await addDoc(collection(db, 'chats'), newMessageData);
 
            // Append the new message to the existing messages
            setMessages([...messages, newMessageData]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
 
    console.log(messages);
 
 
    return (
        < >