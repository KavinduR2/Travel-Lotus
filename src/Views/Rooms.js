import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; // Firestore imports
import { db } from "../firebase"; // Update this path to match our Firebase config file
import { Container, Row, Col, Card, Button, Spinner, Form } from "react-bootstrap";
import { FaBed, FaHome, FaMoneyBillWave } from "react-icons/fa"; // Import icons from react-icons

// Currency conversion rates
const currencyRates = {
    LKR: 299,
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    INR: 82.5,
    KES: 150, // Example conversion rate
};

const Rooms = () => {
    const [rooms, setRooms] = useState([]); // State to hold rooms data
    const [loading, setLoading] = useState(true); // Loading state
    const [currency, setCurrency] = useState("USD"); // Default currency
    const navigate = useNavigate(); // React Router navigate function

    // Fetch rooms data from Firestore
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Rooms"));
                const roomData = [];
                querySnapshot.forEach((doc) => {
                    roomData.push({ id: doc.id, ...doc.data() });
                });
                setRooms(roomData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching rooms: ", error);
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);
