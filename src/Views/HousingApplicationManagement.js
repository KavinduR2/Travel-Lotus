import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { Container, Row, Col, Button, Table, Modal, Card, Badge, Form, ListGroup, Offcanvas } from "react-bootstrap";
import * as XLSX from "xlsx";
import { FaHome, FaMoneyBillWave, FaTools, FaSignOutAlt, FaBars, FaUser, FaExclamationTriangle, FaBed, FaFileAlt, FaDownload } from 'react-icons/fa';

const HousingApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Helper function to format submissionDate
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  // Fetch applications from Firestore on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "housingApplications"));
        const fetchedApplications = [];
        querySnapshot.forEach((doc) => {
          fetchedApplications.push({ id: doc.id, ...doc.data() });
        });
        setApplications(fetchedApplications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications: ", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Handler to accept an application
  const handleAccept = async (applicationId, roomId) => {
    try {
      const applicationRef = doc(db, "housingApplications", applicationId);
      const roomRef = doc(db, "Rooms", roomId);

      await updateDoc(applicationRef, { application: "Accepted" });
      await updateDoc(roomRef, { NumberOfBed: increment(-1) });

      alert(`Request Accepted for Application ID: ${applicationId}`);

      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, application: "Accepted" } : app
        )
      );
    } catch (error) {
      console.error("Error updating application status: ", error);
      alert("Failed to update application status. Please try again.");
    }
  };

  // Handler to decline an application and update room bed count
  const handleDecline = async (application) => {
    try {
      const applicationRef = doc(db, "housingApplications", application.id);
      const roomRef = doc(db, "Rooms", application.roomId);

      await updateDoc(applicationRef, { application: "Declined" });
      await updateDoc(roomRef, { NumberOfBed: increment(1) });

      alert(`Request Declined for Application ID: ${application.id} and bed count updated`);

      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === application.id ? { ...app, application: "Declined" } : app
        )
      );
    } catch (error) {
      console.error("Error declining application or updating room bed count: ", error);
      alert("Failed to decline application or update bed count. Please try again.");
    }
  };

  // Show application details in a popup
  const handleViewForm = (application) => {
    setSelectedApplication(application);
  };

  const handleClosePopup = () => {
    setSelectedApplication(null);
  };

  // Download report handler
  const handleDownloadReport = () => {
    if (applications.length === 0) {
      alert("No data available to export!");
      return;
    }

    const exportData = applications.map((application) => ({
      "Application ID": application.id,
      "Room Number": application.RoomNo || "N/A",
      "Customer Name": `${application.firstName || ""} ${application.lastName || ""}`.trim() || "N/A",
      "Submission Date": formatDate(application.submissionDate),
      "Address": application.currentAddress || "N/A",
      "Phone Number": application.mobileNumber || "N/A",
      "Application Status": application.application || "N/A",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "HousingApplicationsReport.xlsx");
  };

  // Filter applications based on status and date range
  const filteredApplications = applications.filter((application) => {
    const applicationDate = new Date(application.submissionDate);
    const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;

    const matchesDate = (!startDate || applicationDate >= startDate) && (!endDate || applicationDate <= endDate);
    const matchesStatus = filterStatus === "all" || application.application === filterStatus;

    return matchesDate && matchesStatus;
  });

  // Summary data
  const totalApplications = applications.length;
  const acceptedApplications = applications.filter((app) => app.application === "Accepted").length;
  const declinedApplications = applications.filter((app) => app.application === "Declined").length;
  const pendingApplications = applications.filter((app) => app.application === "Pending").length;

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
      <div style={{ backgroundImage: `url('/Images/housingapplicationmanagement.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', paddingTop: '2rem', paddingBottom: '5rem', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="text-center mb-4 w-100">
          <h1 className="display-5 fw-bold" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', background: 'rgba(0, 0, 0, 0.3)', padding: '12px 25px', borderRadius: '10px', display: 'inline-block' }}>Housing Application Management</h1>
        </div>

        {/* Housing Applications Table with Filters */}
        <Card className="shadow-lg border-0 w-100 mb-4" style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Card.Header className="bg-primary text-white py-3">
            <h4 className="mb-0 d-flex align-items-center"><FaFileAlt className="me-2" /> Housing Applications</h4>
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

            {/* Applications Table */}
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Room Number</th>
                  <th>Customer Name</th>
                  <th>Customer Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>View</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.RoomNo || "N/A"}</td>
                    <td>{application.firstName || "N/A"}</td>
                    <td>{application.email || "N/A"}</td>
                    <td>{formatDate(application.submissionDate)}</td>
                    <td>
                      {application.application === "Accepted" ? (
                        <Badge bg="success">Accepted</Badge>
                      ) : application.application === "Declined" ? (
                        <Badge bg="danger">Declined</Badge>
                      ) : (
                        <Badge bg="warning">Pending</Badge>
                      )}
                    </td>
                    <td>
                      <Button variant="info" onClick={() => handleViewForm(application)}>View Form</Button>
                    </td>
                    <td>
                      <Button
                        style={{ marginRight: 10 }}
                        variant="success"
                        onClick={() => handleAccept(application.id, application.roomId)}
                        disabled={application.application === "Accepted"}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDecline(application)}
                        disabled={application.application === "Declined"}
                      >
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

        {/* Summary Cards */}
        <Row className="mb-4 w-100 px-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Col md={3} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-primary text-white"><h5 className="mb-0">Total Applications</h5></Card.Header>
              <Card.Body className="text-center p-3"><h4 className="mb-0">{totalApplications}</h4><small className="text-muted">All Applications</small></Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-success text-white"><h5 className="mb-0">Accepted Applications</h5></Card.Header>
              <Card.Body className="text-center p-3"><h4 className="mb-0">{acceptedApplications}</h4><small className="text-muted">Accepted Applications</small></Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-warning text-white"><h5 className="mb-0">Declined Applications</h5></Card.Header>
              <Card.Body className="text-center p-3"><h4 className="mb-0">{declinedApplications}</h4><small className="text-muted">Declined Applications</small></Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-danger text-white"><h5 className="mb-0">Pending Applications</h5></Card.Header>
              <Card.Body className="text-center p-3"><h4 className="mb-0">{pendingApplications}</h4><small className="text-muted">Pending Applications</small></Card.Body>
            </Card>
          </Col>
        </Row>
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

      {/* Application Details Modal */}
      {selectedApplication && (
        <Modal show={true} onHide={handleClosePopup}>
          <Modal.Header closeButton>
            <Modal.Title>Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Room Number:</strong> {selectedApplication.RoomNo || "N/A"}</p>
            <p><strong>Customer Name:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</p>
            <p><strong>Submission Date:</strong> {formatDate(selectedApplication.submissionDate)}</p>
            <p><strong>Address:</strong> {selectedApplication.currentAddress || "N/A"}</p>
            <p><strong>Phone Number:</strong> {selectedApplication.mobileNumber || "N/A"}</p>
            <p><strong>Status:</strong> {selectedApplication.application || "N/A"}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClosePopup}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default HousingApplicationManagement;