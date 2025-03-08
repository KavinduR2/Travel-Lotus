import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Modal, Form } from 'react-bootstrap';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const LandOwnerHome = ({ userDetails }) => {
    const [chats, setChats] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    // const user = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        fetchChats();
    }, []);
    console.log(userDetails);


    const fetchChats = async () => {
        if (!userDetails) return;

        setLoading(true);
        try {
            const chatsRef = collection(db, 'chats');
            const q = query(chatsRef, orderBy('timestamp', 'asc')); // Fetch chats in ascending order
            const querySnapshot = await getDocs(q);

            const groupedChats = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!groupedChats[data.GuestEmail]) {
                    groupedChats[data.GuestEmail] = [];
                }

                groupedChats[data.GuestEmail].push({
                    id: doc.id,
                    message: data.message,
                    Sender: data.Sender,
                    timestamp: data.timestamp.toDate(),
                });
            });

            setChats(groupedChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
        setLoading(false);
    };

    const handleViewChat = (GuestEmail) => {
        setSelectedGuest(GuestEmail);

        // No need to sort as they are fetched in ascending order
        setChatMessages([...chats[GuestEmail]]);
        setShowModal(true);
    };

    console.log(chatMessages);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedGuest) return;

        try {
            const chatsRef = collection(db, 'chats');
            const timestamp = new Date();
            await addDoc(chatsRef, {
                GuestEmail: selectedGuest,
                landownerEmail: userDetails.email,
                message: newMessage,
                timestamp,
                Sender: 'Landowner',
            });

            const newChatMessage = {
                message: newMessage,
                timestamp,
                Sender: 'Landowner',
            };

            // Append the new message to chatMessages
            setChatMessages([...chatMessages, newChatMessage]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    