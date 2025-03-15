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
  
