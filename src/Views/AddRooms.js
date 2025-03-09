import React, { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // Adjust the path to your firebase.js
import { collection, addDoc } from "firebase/firestore";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
 
const AddRooms = () => {
    const [RoomData, setRoomData] = useState({
        RoomNo: "",
        Floor: "",
        NumberOfBed: "",
        description: "",
    });
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData({ ...RoomData, [name]: value });
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Adding static price field to Firestore
            const roomWithPrice = { ...RoomData, RoomPrice: 135.59 };
            const docRef = await addDoc(collection(db, "Rooms"), roomWithPrice);
            console.log("Document written with ID: ", docRef.id);
            alert("Room details added successfully!");
            setRoomData({ RoomNo: "", Floor: "", NumberOfBed: "", description: "" });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add Room details. Please try again.");
        }
    };