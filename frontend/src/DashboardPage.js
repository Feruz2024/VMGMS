import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const cards = [
  { label: "Total Customers", value: 120 },
  { label: "Total Vehicles", value: 85 },
  { label: "Open Appointments", value: 14 },
  { label: "Active Work Orders", value: 7 },
  { label: "Low Inventory Items", value: 3 },
  { label: "Outstanding Invoices", value: 5 },
];

function OverviewCards() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 4 }}>
      {cards.map((card) => (
        <Paper key={card.label} sx={{ p: 3, minWidth: 180, textAlign: 'center', flex: '0 1 220px' }}>
          <Typography variant="subtitle1">{card.label}</Typography>
          <Typography variant="h4" color="primary">{card.value}</Typography>
        </Paper>
      ))}
    </Box>
  );
}

function GraphsSection() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Paper sx={{ p: 3, minWidth: 600, minHeight: 180, width: '70%', textAlign: 'center' }}>
        <Typography variant="h6">Graphs</Typography>
        {/* Placeholder for future graphs/charts */}
      </Paper>
    </Box>
  );
}

function RecentActivity() {
  return (
    <Box sx={{ position: 'absolute', top: 0, right: 0, width: 320, minHeight: 350, p: 2 }}>
      <Paper sx={{ p: 2, minHeight: 300, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        <Typography variant="body2">Appointment: John Doe - 2025-06-04</Typography>
        <Typography variant="body2">Work Order: Oil Change - 2025-06-03</Typography>
        <Typography variant="body2">Payment: Invoice #1234 - $200</Typography>
        <Typography variant="body2">Vehicle Added: Honda Civic</Typography>
      </Paper>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <Box sx={{ position: 'relative', minHeight: '80vh', pt: 4, pl: 2, pr: 2, display: 'flex' }}>
      <Box sx={{ flex: 1, pr: 4 }}>
        <Typography variant="h4" gutterBottom>Overview</Typography>
        <OverviewCards />
        <GraphsSection />
      </Box>
      <Box sx={{ width: 340, position: 'relative' }}>
        <RecentActivity />
      </Box>
    </Box>
  );
}
