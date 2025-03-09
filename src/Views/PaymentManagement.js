import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
 
const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
 
    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return date.toISOString().split("T")[0];
    };
    useEffect(() => {
        const fetchPayments = async () => {
            const querySnapshot = await getDocs(collection(db, "payments"));
            const fetchedPayments = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPayments(fetchedPayments);
        };
 
        fetchPayments();
    }, []);
 
    const handleDownloadReport = () => {
        const headers = ["Room Number,Customer Name,Date,Payment Amount"];
        const rows = payments.map(payment =>
            `${payment.roomNumber},${payment.customerName},${payment.date},${payment.paymentAmount}`
        );
        const csvContent = [headers, ...rows].join("\n");
 
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "payments_report.csv";
        link.click();
        URL.revokeObjectURL(url);
    };
 