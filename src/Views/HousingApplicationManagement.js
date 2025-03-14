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
