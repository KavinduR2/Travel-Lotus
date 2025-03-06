import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; // Firestore imports
import { db } from "../firebase"; // Update this path to match our Firebase config file
import { Container, Row, Col, Card, Button, Spinner, Form } from "react-bootstrap";
import { FaBed, FaHome, FaMoneyBillWave } from "react-icons/fa"; // Import icons from react-icons