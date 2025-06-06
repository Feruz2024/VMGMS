import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from "@mui/material";
import { fetchVehicles, createVehicle } from './api';

export default function VehiclesPage() {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    vin: "",
    license: "",
    color: "",
    engine: "",
    notes: ""
  });
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchVehicles().then(setVehicles);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.brand || !form.model || !form.year || !form.vin || !form.license) {
      setError("Brand, Model, Year, VIN, and License Plate are required.");
      return;
    }
    try {
      const newVehicle = await createVehicle(form);
      setVehicles([newVehicle, ...vehicles]);
      setSuccess("Vehicle created successfully!");
      setForm({ brand: "", model: "", year: "", vin: "", license: "", color: "", engine: "", notes: "" });
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
              <TextField label="Brand" name="brand" value={form.brand} onChange={handleChange} fullWidth required />
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
              <TextField label="License Plate" name="license" value={form.license} onChange={handleChange} fullWidth required />
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
                <TableCell>Brand</TableCell>
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
                  <TableCell>{v.brand}</TableCell>
                  <TableCell>{v.model}</TableCell>
                  <TableCell>{v.year}</TableCell>
                  <TableCell>{v.vin}</TableCell>
                  <TableCell>{v.license}</TableCell>
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
