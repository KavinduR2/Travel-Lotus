import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Button, Container, Offcanvas, Modal, Card, Row, Col, Form, Badge, ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FaHome, FaMoneyBillWave, FaTools, FaSignOutAlt, FaBars, FaUser, FaExclamationTriangle, FaBed, FaFileAlt, FaDownload, FaEye, FaPrint } from 'react-icons/fa';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [monthlyData, setMonthlyData] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

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
            processMonthlyData(fetchedPayments);
        };

        const processMonthlyData = (fetchedPayments) => {
            const monthlyGroups = {};
            fetchedPayments.forEach(payment => {
                if (!payment.paymentDate) return;
                const date = new Date(payment.paymentDate);
                const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
                if (!monthlyGroups[monthYear]) {
                    monthlyGroups[monthYear] = 0;
                }
                monthlyGroups[monthYear] += parseFloat(payment.paymentAmount) || 0;
            });

            const monthlyDataArray = Object.keys(monthlyGroups).map(month => ({
                month: month,
                amount: monthlyGroups[month].toFixed(2)
            }));
            setMonthlyData(monthlyDataArray);

            setRecentPayments(
                fetchedPayments
                    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                    .slice(0, 5)
            );
        };

        fetchPayments();
    }, []);

    const totalPayments = payments.reduce((total, payment) => 
        total + (parseFloat(payment.paymentAmount) || 0), 0).toFixed(2);

    const pendingPayments = payments.filter(p => 
        p.status === "pending").length;

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

    const filteredPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;

        const matchesDate = (!startDate || paymentDate >= startDate) && (!endDate || paymentDate <= endDate);
        const matchesStatus = filterStatus === "all" || payment.status === filterStatus;

        return matchesDate && matchesStatus;
    });

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid px-4">
                    <Button variant="outline-light" className="me-2" onClick={() => setShowSidebar(true)}>
                        <FaBars size={20} />
                    </Button>
                    <div className="d-flex justify-content-center align-items-center flex-grow-1">
                        <img src="/images/logo.png" alt="Travel Lotus Logo" height="50" className="me-2" />
                        <Link className="navbar-brand mb-0" to="/home" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffffff', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', letterSpacing: '1px', textDecoration: 'none' }}>
                            Travel Lotus
                            <span style={{ fontSize: '0.5em', display: 'block', color: '#fff', fontWeight: 'normal', opacity: 0.9 }}>Landlord Portal</span>
                        </Link>
                    </div>
                    <div className="ms-auto">
                        <Button variant="danger" className="me-2 rounded-pill d-flex align-items-center" onClick={() => setShowEmergencyModal(true)}>
                            <FaExclamationTriangle className="me-2" size={14} /> Emergency
                        </Button>
                    </div>
                </div>
            </nav>

            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} backdrop="static">
                <Offcanvas.Header className="bg-dark text-white">
                    <Offcanvas.Title>
                        <div className="d-flex align-items-center">
                            <img src="/images/logo.png" alt="Travel Lotus Logo" height="40" className="me-2" />
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #0069d9, #8e44ad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Travel Lotus</div>
                                <span style={{ fontSize: '0.7em', display: 'block', color: '#fff', fontWeight: 'normal', opacity: 0.8 }}>Landlord Portal</span>
                            </div>
                        </div>
                    </Offcanvas.Title>
                    <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setShowSidebar(false)} style={{ position: 'absolute', right: '1rem' }} />
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="d-flex flex-column">
                        <div className="p-3 border-bottom">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary rounded-circle p-3 text-white me-3">
                                    <FaUser size={24} />
                                </div>
                                <div>
                                    <h5 className="mb-0">Landlord</h5>
                                    <small className="text-muted">Property Manager</small>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Link to="/home" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3"><FaHome className="me-3" /> Dashboard</Link>
                            <Link to="/PaymentManagement" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3"><FaMoneyBillWave className="me-3" /> Payment Management</Link>
                            <Link to="/MaintenanceManagement" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3"><FaTools className="me-3" /> Maintenance Management</Link>
                            <Link to="/HousingApplicationManagement" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3"><FaFileAlt className="me-3" /> Application Management</Link>
                            <Link to="/add-room" className="btn btn-light w-100 text-start d-flex align-items-center mb-3 p-3"><FaBed className="me-3" /> Add Rooms</Link>
                            <Link to="/" className="btn btn-danger w-100 text-start d-flex align-items-center mb-3 p-3"><FaSignOutAlt className="me-3" /> Logout</Link>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <div style={{ backgroundImage: `url('/Images/paymentpage.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', paddingTop: '2rem', paddingBottom: '5rem' }}>
                <div className="text-center mb-4 w-100">
                    <h1 className="display-5 fw-bold" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', background: 'rgba(0, 0, 0, 0.3)', padding: '12px 25px', borderRadius: '10px', display: 'inline-block' }}>Payment Management</h1>
                </div>

                {/* Payment Records Card */}
                <Card className="shadow-lg border-0 w-100 mb-4" style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Card.Header className="bg-primary text-white py-3">
                        <h4 className="mb-0 d-flex align-items-center"><FaMoneyBillWave className="me-2" /> Payment Records</h4>
                    </Card.Header>
                    <Card.Body>
                        {/* Filter Options */}
                        <Row className="mb-4">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Payment Records Table */}
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Date</th>
                                    <th>Payment Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(payment => (
                                    <tr key={payment.id}>
                                        <td>{payment.email}</td>
                                        <td>{formatDate(payment.paymentDate)}</td>
                                        <td>{payment.paymentAmount}</td>
                                        <td>
                                            {payment.status === 'completed' ? (
                                                <Badge bg="success">Completed</Badge>
                                            ) : payment.status === 'pending' ? (
                                                <Badge bg="warning">Pending</Badge>
                                            ) : (
                                                <Badge bg="danger">Failed</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" className="me-1">
                                                <FaEye /> View
                                            </Button>
                                            <Button variant="outline-secondary" size="sm">
                                                <FaPrint /> Receipt
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button variant="primary" onClick={handleDownloadReport} className="d-flex align-items-center">
                            <FaDownload className="me-2" /> Download Report
                        </Button>
                    </Card.Body>
                </Card>

                {/* Spacing Between Payment Records and Three Cards */}
                <div className="mb-4"></div>

                {/* Three Cards (Total Received, Total Transactions, Pending Payments) */}
                <Row className="w-100 px-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-primary text-white"><h5 className="mb-0">Total Received</h5></Card.Header>
                            <Card.Body className="text-center p-3"><h4 className="mb-0">${totalPayments}</h4><small className="text-muted">All Payment Transactions</small></Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-success text-white"><h5 className="mb-0">Total Transactions</h5></Card.Header>
                            <Card.Body className="text-center p-3"><h4 className="mb-0">{payments.length}</h4><small className="text-muted">Number of Payments</small></Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-warning text-white"><h5 className="mb-0">Pending Payments</h5></Card.Header>
                            <Card.Body className="text-center p-3"><h4 className="mb-0">{pendingPayments}</h4><small className="text-muted">Awaiting Confirmation</small></Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Monthly Summary and Recent Activity */}
                <Row className="w-100 px-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Col md={6} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-primary text-white"><h5 className="mb-0">Monthly Payment Summary</h5></Card.Header>
                            <Card.Body>
                                {monthlyData.length > 0 ? (
                                    <Table striped hover size="sm">
                                        <thead><tr><th>Month</th><th>Amount</th></tr></thead>
                                        <tbody>{monthlyData.map((item, index) => (<tr key={index}><td>{item.month}</td><td>${item.amount}</td></tr>))}</tbody>
                                    </Table>
                                ) : (<p className="text-center text-muted my-4">No monthly data available</p>)}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Header className="bg-success text-white"><h5 className="mb-0">Recent Activity</h5></Card.Header>
                            <Card.Body>
                                {recentPayments.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {recentPayments.map(payment => (
                                            <ListGroup.Item key={payment.id} className="d-flex justify-content-between align-items-center">
                                                <div><strong>Payment {payment.status}</strong><div className="text-muted small">From: {payment.email || "Unknown"}</div><div className="text-muted small">Date: {formatDate(payment.paymentDate)}</div></div>
                                                <Badge bg={payment.status === 'completed' ? 'success' : 'warning'}>${parseFloat(payment.paymentAmount).toFixed(2)}</Badge>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (<p className="text-center text-muted my-4">No recent activity</p>)}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Footer and Emergency Modal */}
            <footer className="bg-dark text-white py-4 w-100">
                <Container>
                    <Row className="text-center text-md-start">
                        <Col md={4} className="mb-3 mb-md-0"><h5 className="mb-3">Travel Lotus</h5><p className="mb-0">Landlord Portal</p><p className="mb-0">© 2025 Travel Lotus. All rights reserved.</p></Col>
                        <Col md={4} className="mb-3 mb-md-0"><h5 className="mb-3">Quick Links</h5><ul className="list-unstyled"><li><Link to="/home" className="text-white text-decoration-none">Dashboard</Link></li><li><Link to="/PaymentManagement" className="text-white text-decoration-none">Payments</Link></li><li><Link to="/MaintenanceManagement" className="text-white text-decoration-none">Maintenance</Link></li></ul></Col>
                        <Col md={4}><h5 className="mb-3">Contact</h5><p className="mb-0">Email: TravelLotuscc@gmail.com</p><p className="mb-0">FaceBook : Travel Lotus</p></Col>
                    </Row>
                </Container>
            </footer>

            <Modal show={showEmergencyModal} onHide={() => setShowEmergencyModal(false)}>
                <Modal.Header closeButton><Modal.Title>Emergency Contacts</Modal.Title></Modal.Header>
                <Modal.Body>
                    <h5 className="text-center mb-4">**TRAVEL LOTUS SOS**</h5>
                    <p><strong>Travel Lotus Admin Panel:</strong> 0000</p>
                    <p><strong>Sri Lankan Police:</strong> 119</p>
                    <p><strong>Ambulance:</strong> 1990</p>
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowEmergencyModal(false)}>Close</Button></Modal.Footer>
            </Modal>
        </>
    );
};

export default PaymentManagement;