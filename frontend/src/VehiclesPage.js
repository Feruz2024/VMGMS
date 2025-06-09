import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { fetchVehicles, createVehicle, fetchCustomers } from './api';

export default function VehiclesPage() {
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    license_plate: "",
    color: "",
    engine: "",
    notes: "",
    customer: ""
  });
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchVehicles().then(setVehicles);
    fetchCustomers().then(setCustomers);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.make || !form.model || !form.year || !form.vin || !form.license_plate || !form.customer) {
      setError("Make, Model, Year, VIN, License Plate, and Customer are required.");
      return;
    }
    try {
      const newVehicle = await createVehicle(form);
      setVehicles([newVehicle, ...vehicles]);
      setSuccess("Vehicle created successfully!");
      setForm({ make: "", model: "", year: "", vin: "", license_plate: "", color: "", engine: "", notes: "", customer: "" });
    } catch (err) {
      setError("Failed to create vehicle.");
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Add New Vehicle</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Customer</InputLabel>
                <Select
                  name="customer"
                  value={form.customer}
                  label="Customer"
                  onChange={handleChange}
                >
                  {customers.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Make" name="make" value={form.make} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Model" name="model" value={form.model} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Year" name="year" value={form.year} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="VIN" name="vin" value={form.vin} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="License Plate" name="license_plate" value={form.license_plate} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Color" name="color" value={form.color} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Engine Size" name="engine" value={form.engine} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth multiline minRows={2} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>Add Vehicle</Button>
            </Grid>
          </Grid>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Vehicles List</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>VIN</TableCell>
                <TableCell>License Plate</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Engine</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>{(customers.find(c => c.id === v.customer) || {}).name || v.customer}</TableCell>
                  <TableCell>{v.make}</TableCell>
                  <TableCell>{v.model}</TableCell>
                  <TableCell>{v.year}</TableCell>
                  <TableCell>{v.vin}</TableCell>
                  <TableCell>{v.license_plate}</TableCell>
                  <TableCell>{v.color}</TableCell>
                  <TableCell>{v.engine}</TableCell>
                  <TableCell>{v.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
