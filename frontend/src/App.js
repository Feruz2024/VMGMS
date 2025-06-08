import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import NavBar from './NavBar';
import DashboardPage from './DashboardPage';
import WorkOrderForm from './WorkOrderForm';
import CustomersPage from './CustomersPage';
import VehiclesPage from './VehiclesPage';


// TEMP: Always allow access for development (bypass login)
const isLoggedIn = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<><NavBar /><DashboardPage /></>} />
        <Route path="/workorders" element={<><NavBar /><WorkOrderForm /></>} />
        <Route path="/customers" element={<><NavBar /><CustomersPage /></>} />
        <Route path="/vehicles" element={<><NavBar /><VehiclesPage /></>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
