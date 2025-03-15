import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Firestore database instance
import { Container, Row, Col, Button, Table, Modal } from "react-bootstrap"; // Bootstrap components
import * as XLSX from "xlsx"; // Import the XLSX library

const HousingApplicationManagement = () => {
  const [applications, setApplications] = useState([]); // State to hold applications
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedApplication, setSelectedApplication] = useState(null); // Selected application for the popup

    // Helper function to format submissionDate
    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A"; // Handle missing timestamps
        const date = new Date(timestamp);
        return date.toISOString().split("T")[0]; // Extract the date in YYYY-MM-DD format
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
        <Row>
          <Col>
            <h1><center>
              Housing Application Management
            </center>
            </h1>
            <br />
            {loading ? (
              <p>Loading applications...</p>
            ) : applications.length === 0 ? (
              <p>No applications available.</p>
            ) : (
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
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td>{application.RoomNo || "N/A"}</td>
                      <td>{application.firstName || "N/A"}</td>
                      <td>{application.email || "N/A"}</td>
                      <td>{formatDate(application.submissionDate)}</td>
                      <td>{application.application}</td>
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
            )}
          </Col>
        </Row>
        <Button variant="primary" onClick={handleDownloadReport}>
          Download Report
        </Button>

        {/* Modal Popup for Viewing Application Details */}
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
              <p><strong>Status:</strong> {selectedApplication.status || "N/A"}</p>
              <p><strong>Application Status:</strong> {selectedApplication.application || "N/A"}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClosePopup}>Close</Button>
            </Modal.Footer>
          </Modal>
        )}
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

export default HousingApplicationManagement;

