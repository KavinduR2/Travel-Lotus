import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Button, Container, Offcanvas, Card, Row, Col, Badge, Form, ListGroup, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { FaHome, FaMoneyBillWave, FaTools, FaSignOutAlt, FaBars, FaUser, FaExclamationTriangle, FaBed, FaFileAlt, FaDownload } from 'react-icons/fa';

const MaintenanceManagement = () => {
    const [requests, setRequests] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterStartDate, setFilterStartDate] = useState("");
    const [filterEndDate, setFilterEndDate] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            const querySnapshot = await getDocs(collection(db, "maintenanceRequests"));
            const fetchedRequests = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRequests(fetchedRequests);
        };

        fetchRequests();
    }, []);

    const handleAccept = async (id) => {
        try {
            const requestDocRef = doc(db, "maintenanceRequests", id);
            await updateDoc(requestDocRef, { status: "Accepted" });

            const updatedRequests = requests.map(request =>
                request.id === id ? { ...request, status: "Accepted" } : request
            );
            setRequests(updatedRequests);
            alert("Request Accepted");
        } catch (error) {
            console.error("Error updating request status: ", error);
            alert("Failed to accept the request. Please try again.");
        }
    };

    const handleDecline = async (id) => {
        try {
            const requestDocRef = doc(db, "maintenanceRequests", id);
            await updateDoc(requestDocRef, { status: "Declined" });

            const updatedRequests = requests.map(request =>
                request.id === id ? { ...request, status: "Declined" } : request
            );
            setRequests(updatedRequests);
            alert("Request Declined");
        } catch (error) {
            console.error("Error updating request status: ", error);
            alert("Failed to decline the request. Please try again.");
        }
    };

    const handleDownloadReport = () => {
        const headers = ["Room Number,Customer Name,Date,Remark,Status"];
        const rows = requests.map(
            (request) =>
                `${request.roomNumber},${request.fullName},${request.submissionDate},${request.reason},${request.status || "Pending"}`
        );
        const csvContent = [headers, ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "maintenance_report.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const filteredRequests = requests.filter(request => {
        const requestDate = new Date(request.submissionDate);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;

        const matchesDate = (!startDate || requestDate >= startDate) && (!endDate || requestDate <= endDate);
        const matchesStatus = filterStatus === "all" || request.status === filterStatus;

        return matchesDate && matchesStatus;
    });

    const totalRequests = requests.length;
    const acceptedRequests = requests.filter(request => request.status === "Accepted").length;
    const declinedRequests = requests.filter(request => request.status === "Declined").length;
    const recentRequests = requests.slice(0, 5); // Show the last 5 requests

    return (
        <>
            {/* Navbar */}
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

            {/* Sidebar */}
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

            {/* Main Content */}
            <div style={{ backgroundImage: `url('/Images/maintaincemanagement.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', paddingTop: '2rem', paddingBottom: '5rem', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="text-center mb-4 w-100">
                    <h1 className="display-5 fw-bold" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', background: 'rgba(0, 0, 0, 0.3)', padding: '12px 25px', borderRadius: '10px', display: 'inline-block' }}>Maintenance Management</h1>
                </div>

                {/* Summary Cards */}
                <Row className="mb-4 w-100 px-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-primary text-white"><h5 className="mb-0">Total Requests</h5></Card.Header>
                            <Card.Body className="text-center p-3"><h4 className="mb-0">{totalRequests}</h4><small className="text-muted">All Maintenance Requests</small></Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-success text-white"><h5 className="mb-0">Accepted Requests</h5></Card.Header>
                            <Card.Body className="text-center p-3"><h4 className="mb-0">{acceptedRequests}</h4><small className="text-muted">Accepted Maintenance Requests</small></Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-warning text-white"><h5 className="mb-0">Declined Requests</h5></Card.Header>
                            <Card.Body className="text-center p-3"><h4 className="mb-0">{declinedRequests}</h4><small className="text-muted">Declined Maintenance Requests</small></Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Maintenance Requests Table */}
                <Card className="shadow-lg border-0 w-100 mb-4" style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Card.Header className="bg-primary text-white py-3">
                        <h4 className="mb-0 d-flex align-items-center"><FaTools className="me-2" /> Maintenance Requests</h4>
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
                                        <option value="Accepted">Accepted</option>
                                        <option value="Declined">Declined</option>
                                        <option value="Pending">Pending</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>Room Number</th>
                                    <th>Customer Name</th>
                                    <th>Date</th>
                                    <th>Remark</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.roomNumber}</td>
                                        <td>{request.fullName}</td>
                                        <td>{request.submissionDate}</td>
                                        <td>{request.reason}</td>
                                        <td>
                                            {request.status === 'Accepted' ? (
                                                <Badge bg="success">Accepted</Badge>
                                            ) : request.status === 'Declined' ? (
                                                <Badge bg="danger">Declined</Badge>
                                            ) : (
                                                <Badge bg="warning">Pending</Badge>
                                            )}
                                        </td>
                                        <td>
                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleAccept(request.id)}>
                                                Accept
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDecline(request.id)}>
                                                Decline
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

                {/* Recent Activity */}
                <Card className="shadow-lg border-0 w-100 mb-4" style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Card.Header className="bg-success text-white py-3">
                        <h4 className="mb-0 d-flex align-items-center"><FaTools className="me-2" /> Recent Activity</h4>
                    </Card.Header>
                    <Card.Body>
                        {recentRequests.length > 0 ? (
                            <ListGroup variant="flush">
                                {recentRequests.map(request => (
                                    <ListGroup.Item key={request.id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>Request from {request.fullName}</strong>
                                            <div className="text-muted small">Room: {request.roomNumber}</div>
                                            <div className="text-muted small">Date: {request.submissionDate}</div>
                                        </div>
                                        <Badge bg={request.status === 'Accepted' ? 'success' : request.status === 'Declined' ? 'danger' : 'warning'}>
                                            {request.status || "Pending"}
                                        </Badge>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p className="text-center text-muted my-4">No recent activity</p>
                        )}
                    </Card.Body>
                </Card>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white py-4 w-100">
                <Container>
                    <Row className="text-center text-md-start">
                        <Col md={4} className="mb-3 mb-md-0"><h5 className="mb-3">Travel Lotus</h5><p className="mb-0">Landlord Portal</p><p className="mb-0">© 2025 Travel Lotus. All rights reserved.</p></Col>
                        <Col md={4} className="mb-3 mb-md-0"><h5 className="mb-3">Quick Links</h5><ul className="list-unstyled"><li><Link to="/home" className="text-white text-decoration-none">Dashboard</Link></li><li><Link to="/PaymentManagement" className="text-white text-decoration-none">Payments</Link></li><li><Link to="/MaintenanceManagement" className="text-white text-decoration-none">Maintenance</Link></li></ul></Col>
                        <Col md={4}><h5 className="mb-3">Contact</h5><p className="mb-0">Email: TravelLotuscc@gmail.com</p><p className="mb-0">FaceBook : Travel Lotus</p></Col>
                    </Row>
                </Container>
            </footer>

            {/* Emergency Modal */}
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

export default MaintenanceManagement;