import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Paper, MenuItem, Select, InputLabel, FormControl, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { fetchCustomers, fetchVehicles, fetchWorkOrders, createWorkOrder } from './api';

const techniciansList = [
  { id: 1, name: "Tech Mike" },
  { id: 2, name: "Tech Anna" },
];
const statusOptions = [
  "New", "Diagnosis", "Waiting Approval", "Waiting Parts", "In Progress", "Ready for Pickup", "Completed", "Invoiced", "Cancelled"
];

export default function WorkOrderForm() {
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [form, setForm] = useState({
    service: "",
    createdDate: new Date().toISOString().slice(0, 10),
    deadlineDate: "",
    technician: "",
    status: "New",
    complaint: ""
  });
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [workorders, setWorkorders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
    fetchVehicles().then(setVehicles);
    fetchWorkOrders().then(setWorkorders);
  }, []);

  // Filter vehicles by selected customer
  const filteredVehicles = vehicles.filter(v => !customerId || v.customer === Number(customerId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!customerId || !vehicleId || !form.service || !form.createdDate || !form.deadlineDate || !form.technician || !form.status) {
      setError("All fields except complaint are required.");
      return;
    }
    try {
      const newWO = await createWorkOrder({
        customer: customerId,
        vehicle: vehicleId,
        service: form.service,
        created_at: form.createdDate,
        deadline: form.deadlineDate,
        technician: form.technician,
        status: form.status,
        customer_complaint: form.complaint
      });
      setWorkorders([newWO, ...workorders]);
      setSuccess("Work order created successfully!");
      setForm({ service: "", createdDate: new Date().toISOString().slice(0, 10), deadlineDate: "", technician: "", status: "New", complaint: "" });
      setCustomerId("");
      setVehicleId("");
    } catch (err) {
      setError("Failed to create work order.");
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Create Work Order</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Customer</InputLabel>
                <Select
                  value={customerId}
                  label="Customer"
                  onChange={e => setCustomerId(e.target.value)}
                >
                  {customers.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                  <MenuItem value="new" onClick={() => setShowCustomerDialog(true)}>
                    + New Customer
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Vehicle</InputLabel>
                <Select
                  value={vehicleId}
                  label="Vehicle"
                  onChange={e => setVehicleId(e.target.value)}
                  disabled={!customerId}
                >
                  {filteredVehicles.map(v => (
                    <MenuItem key={v.id} value={v.id}>{`${v.brand} ${v.model} (${v.license})`}</MenuItem>
                  ))}
                  <MenuItem value="new" onClick={() => setShowVehicleDialog(true)}>
                    + New Vehicle
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Service" fullWidth margin="normal" required value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Created Date" type="date" fullWidth margin="normal" value={form.createdDate} onChange={e => setForm(f => ({ ...f, createdDate: e.target.value }))} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Deadline Date" type="date" fullWidth margin="normal" value={form.deadlineDate} onChange={e => setForm(f => ({ ...f, deadlineDate: e.target.value }))} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Technician</InputLabel>
                <Select
                  value={form.technician}
                  label="Technician"
                  onChange={e => setForm(f => ({ ...f, technician: e.target.value }))}
                >
                  {techniciansList.map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status}
                  label="Status"
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  {statusOptions.map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Customer Complaint" fullWidth margin="normal" multiline minRows={2} value={form.complaint} onChange={e => setForm(f => ({ ...f, complaint: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary" type="submit">Create Work Order</Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Work Orders List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Deadline</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workorders.map((wo) => (
                <TableRow key={wo.id}>
                  <TableCell>{wo.customer_name || wo.customer}</TableCell>
                  <TableCell>{wo.vehicle_name || wo.vehicle}</TableCell>
                  <TableCell>{wo.service}</TableCell>
                  <TableCell>{wo.status}</TableCell>
                  <TableCell>{wo.technician_name || wo.technician}</TableCell>
                  <TableCell>{wo.created_at || wo.createdDate}</TableCell>
                  <TableCell>{wo.deadline || wo.deadlineDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
