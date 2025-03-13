//maintainence management webpage created
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const MaintenanceManagement = () => {
    const [requests, setRequests] = useState([]);
   
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
          <h1 className="text-center mb-4">Maintenance Management</h1>
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
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.roomNumber}</td>
                  <td>{request.fullName}</td>
                  <td>{request.submissionDate}</td>
                  <td>{request.reason}</td>
                  <td>{request.status || "Pending"}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleAccept(request.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDecline(request.id)}
                    >
                      Decline
                    </Button>
                  </td>
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
   
  export default MaintenanceManagement;