import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from "@mui/material";
import { fetchCustomers, createCustomer } from './api';

export default function CustomersPage() {
  const [form, setForm] = useState({
    name: "",
    primary_phone: "",
    email: "",
    telegram: "",
    whatsapp: "",
    address: "",
    notes: ""
  });
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCustomers().then(setCustomers);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.name || !form.primary_phone) {
      setError("Customer name and phone are required.");
      return;
    }
    try {
      const newCustomer = await createCustomer(form);
      setCustomers([newCustomer, ...customers]);
      setSuccess("Customer created successfully!");
      setForm({ name: "", primary_phone: "", email: "", telegram: "", whatsapp: "", address: "", notes: "" });
    } catch (err) {
      setError("Failed to create customer.");
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Add New Customer</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Customer Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Phone" name="primary_phone" value={form.primary_phone} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Telegram" name="telegram" value={form.telegram} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth multiline minRows={2} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>Add Customer</Button>
            </Grid>
          </Grid>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Customers List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telegram</TableCell>
                <TableCell>WhatsApp</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.primary_phone}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.telegram}</TableCell>
                  <TableCell>{c.whatsapp}</TableCell>
                  <TableCell>{c.address}</TableCell>
                  <TableCell>{c.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
