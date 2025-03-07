// Calling Functions

import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import GuestHome from './GuestHome'; // Import Guest component
import LandOwnerHome from './LandOwnerHome';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';