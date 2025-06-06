import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Work Orders", path: "/workorders" },
  { label: "Customers", path: "/customers" },
  { label: "Vehicles", path: "/vehicles" },
  { label: "Appointments", path: "/appointments" },
  { label: "Inventory", path: "/inventory" },
  { label: "Billing", path: "/billing" },
  { label: "Reports", path: "/reports" },
];

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <AppBar position="static" sx={{ width: "100%", px: 2 }}>
      <Toolbar sx={{ justifyContent: "flex-start" }}>
        <Typography variant="h6" sx={{ mr: 3, fontWeight: 600 }}>
          VMGMS
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {navItems.map((item) => (
            <Button key={item.label} color="inherit" onClick={() => navigate(item.path)}>{item.label}</Button>
          ))}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit">
            <Badge badgeContent={2} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
