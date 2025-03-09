import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const Chat = () => {
    const { GuestEmail } = useParams();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const chatsRef = collection(db, 'chats');
                const q = query(
                    chatsRef,
                    where('GuestEmail', '==', GuestEmail),
                    orderBy('timestamp', 'asc')
                );
                const querySnapshot = await getDocs(q);
                const chats = querySnapshot.docs.map(doc => doc.data());
                setMessages(chats);
            } catch (error) {
                console.error('Error fetching chat:', error);
            }
        };

        fetchMessages();
    }, [GuestEmail]);