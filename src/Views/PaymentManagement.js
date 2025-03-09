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

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">Travel Lotus</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link to="/PaymentManagement" className="nav-link">Payment Management</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/MaintenanceManagement" className="nav-link">Maintenance Management</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/HousingApplicationManagement" className="nav-link">H-Application Management</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/add-room" className="nav-link">Add Rooms</Link>
                            </li>
                            <li className="nav-item" style={{backgroundColor:'red',borderRadius:'10px'}}>
                                <Link to="/" className="nav-link">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Container className="mt-5">
                <h1 className="text-center mb-4">Payment Management</h1>
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            {/* <th>Room Number</th> */}
                            <th>Customer Name</th>
                            <th>Date</th>
                            <th>Payment Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment.id}>
                                {/* <td>{payment.roomId}</td> */}
                                <td>{payment.email}</td>
                                <td>{formatDate(payment.paymentDate)}</td>
                                <td>{payment.paymentAmount}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button variant="primary" onClick={handleDownloadReport}>
                    Download Report
                </Button>
            </Container>
            {/* Footer */}
            <footer className="bg-light text-center py-3" style={{ marginTop: "100px" }}>
                <Container>
                    <p>&copy; 2025 TRAVEL LOTUS. All rights reserved.</p>
                    <p><Link to="/contact">Contact Us</Link> | <Link to="/privacy">Privacy Policy</Link></p>
                </Container>
            </footer>
        </>
    );
};

export default PaymentManagement;