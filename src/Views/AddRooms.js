import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Container, Row, Col, Form, Button, Card, Table, Modal, Offcanvas, Badge } from "react-bootstrap";
import { FaHome, FaMoneyBillWave, FaTools, FaSignOutAlt, FaBars, FaUser, FaExclamationTriangle, FaBed, FaFileAlt, FaTrash } from 'react-icons/fa';

const AddRooms = () => {
    const [roomData, setRoomData] = useState({
        RoomNo: "",
        Floor: "",
        NumberOfBed: "",
        RoomPrice: "",
        description: "",
    });
    const [rooms, setRooms] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch rooms from Firestore on component mount
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Rooms"));
                const fetchedRooms = [];
                querySnapshot.forEach((doc) => {
                    fetchedRooms.push({ id: doc.id, ...doc.data() });
                });
                setRooms(fetchedRooms);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching rooms: ", error);
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData({ ...roomData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add room to Firestore
            const docRef = await addDoc(collection(db, "Rooms"), roomData);
            console.log("Document written with ID: ", docRef.id);
            alert("Room details added successfully!");
            setRoomData({ RoomNo: "", Floor: "", NumberOfBed: "", RoomPrice: "", description: "" });

            // Refresh the rooms list
            const querySnapshot = await getDocs(collection(db, "Rooms"));
            const fetchedRooms = [];
            querySnapshot.forEach((doc) => {
                fetchedRooms.push({ id: doc.id, ...doc.data() });
            });
            setRooms(fetchedRooms);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Failed to add Room details. Please try again.");
        }
    };

    const handleDelete = async (roomId) => {
        try {
            await deleteDoc(doc(db, "Rooms", roomId));
            alert("Room deleted successfully!");

            // Refresh the rooms list
            const querySnapshot = await getDocs(collection(db, "Rooms"));
            const fetchedRooms = [];
            querySnapshot.forEach((doc) => {
                fetchedRooms.push({ id: doc.id, ...doc.data() });
            });
            setRooms(fetchedRooms);
        } catch (error) {
            console.error("Error deleting room: ", error);
            alert("Failed to delete room. Please try again.");
        }
    };

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
            <div style={{ backgroundImage: `url('/Images/addroom.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', paddingTop: '2rem', paddingBottom: '5rem', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="text-center mb-4 w-100">
                    <h1 className="display-5 fw-bold" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', background: 'rgba(0, 0, 0, 0.3)', padding: '12px 25px', borderRadius: '10px', display: 'inline-block' }}>Add Rooms</h1>
                </div>

                {/* Add Room Form */}
                <Card className="shadow-lg border-0 w-100 mb-4" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Card.Header className="bg-primary text-white py-3">
                        <h4 className="mb-0 d-flex align-items-center"><FaBed className="me-2" /> Add New Room</h4>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formRoomNo">
                                        <Form.Label>Room No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="RoomNo"
                                            value={roomData.RoomNo}
                                            onChange={handleChange}
                                            placeholder="Enter room number"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formFloor">
                                        <Form.Label>Floor</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Floor"
                                            value={roomData.Floor}
                                            onChange={handleChange}
                                            placeholder="Enter floor number"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formNumberOfBed">
                                        <Form.Label>Number of Beds</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="NumberOfBed"
                                            value={roomData.NumberOfBed}
                                            onChange={handleChange}
                                            placeholder="Enter number of beds"
                                            required
                                            min="1"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formRoomPrice">
                                        <Form.Label>Room Price (USD)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="RoomPrice"
                                            value={roomData.RoomPrice}
                                            onChange={handleChange}
                                            placeholder="Enter room price"
                                            required
                                            min="0"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Label>Description (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={roomData.description}
                                    onChange={handleChange}
                                    placeholder="Enter additional details about the room"
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Add Room
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Existing Rooms Table */}
                <Card className="shadow-lg border-0 w-100 mb-4" style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Card.Header className="bg-success text-white py-3">
                        <h4 className="mb-0 d-flex align-items-center"><FaBed className="me-2" /> Existing Rooms</h4>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <p>Loading rooms...</p>
                        ) : rooms.length === 0 ? (
                            <p>No rooms available.</p>
                        ) : (
                            <Table striped bordered hover responsive>
                                <thead className="table-dark">
                                    <tr>
                                        <th>Room No</th>
                                        <th>Floor</th>
                                        <th>Number of Beds</th>
                                        <th>Room Price (USD)</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <tr key={room.id}>
                                            <td>{room.RoomNo}</td>
                                            <td>{room.Floor}</td>
                                            <td>{room.NumberOfBed}</td>
                                            <td>{room.RoomPrice}</td>
                                            <td>{room.description || "N/A"}</td>
                                            <td>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(room.id)}>
                                                    <FaTrash /> Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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

export default AddRooms;