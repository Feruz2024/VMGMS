import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert, InputAdornment
} from "@mui/material";
import { Add, Edit, Delete, Inventory2 } from "@mui/icons-material";
import { fetchParts, createPart, updatePart, adjustPartStock, deactivatePart } from "./api";

export default function PartsInventoryPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editPart, setEditPart] = useState(null);
  const [form, setForm] = useState({ part_number: "", description: "", selling_price: "", cost_price: "", quantity_on_hand: "" });
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [adjustPart, setAdjustPart] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    setLoading(true);
    try {
      const data = await fetchParts();
      setParts(data);
    } catch (e) {
      setError("Failed to load parts.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (part = null) => {
    setEditPart(part);
    setForm(part ? { ...part } : { part_number: "", description: "", selling_price: "", cost_price: "", quantity_on_hand: "" });
    setShowDialog(true);
  };

  const handleSavePart = async () => {
    setError(""); setSuccess("");
    try {
      if (editPart) {
        await updatePart(editPart.id, form);
        setSuccess("Part updated.");
      } else {
        await createPart(form);
        setSuccess("Part created.");
      }
      setShowDialog(false);
      loadParts();
    } catch (e) {
      setError("Failed to save part.");
    }
  };

  const handleDeactivate = async (part) => {
    if (!window.confirm("Deactivate this part?")) return;
    try {
      await deactivatePart(part.id);
      setSuccess("Part deactivated.");
      loadParts();
    } catch (e) {
      setError("Failed to deactivate part.");
    }
  };

  const handleOpenAdjust = (part) => {
    setAdjustPart(part);
    setAdjustAmount("");
    setAdjustReason("");
    setShowAdjustDialog(true);
  };

  const handleAdjustStock = async () => {
    setError(""); setSuccess("");
    if (!adjustAmount || !adjustReason) {
      setError("Amount and reason required.");
      return;
    }
    try {
      await adjustPartStock(adjustPart.id, { adjustment_amount: adjustAmount, reason: adjustReason });
      setSuccess("Stock adjusted.");
      setShowAdjustDialog(false);
      loadParts();
    } catch (e) {
      setError("Failed to adjust stock.");
    }
  };

  const filteredParts = parts.filter(p =>
    p.part_number.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Parts Inventory</Typography>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          label="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>Add New Part</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Part Number</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell>Cost Price</TableCell>
              <TableCell>Quantity on Hand</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredParts.map(part => (
              <TableRow key={part.id}>
                <TableCell>{part.part_number}</TableCell>
                <TableCell>{part.description}</TableCell>
                <TableCell>{part.selling_price}</TableCell>
                <TableCell>{part.cost_price}</TableCell>
                <TableCell>{part.quantity_on_hand}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(part)}><Edit /></IconButton>
                  <IconButton onClick={() => handleOpenAdjust(part)}><Inventory2 /></IconButton>
                  <IconButton onClick={() => handleDeactivate(part)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Add/Edit Part Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editPart ? "Edit Part" : "Add New Part"}</DialogTitle>
        <DialogContent>
          <TextField label="Part Number" value={form.part_number} onChange={e => setForm(f => ({ ...f, part_number: e.target.value }))} fullWidth sx={{ mb: 2 }} required disabled={!!editPart} />
          <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Selling Price" type="number" value={form.selling_price} onChange={e => setForm(f => ({ ...f, selling_price: e.target.value }))} fullWidth sx={{ mb: 2 }} required InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
          <TextField label="Cost Price" type="number" value={form.cost_price} onChange={e => setForm(f => ({ ...f, cost_price: e.target.value }))} fullWidth sx={{ mb: 2 }} required InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
          {!editPart && <TextField label="Initial Quantity" type="number" value={form.quantity_on_hand} onChange={e => setForm(f => ({ ...f, quantity_on_hand: e.target.value }))} fullWidth sx={{ mb: 2 }} required />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSavePart} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      {/* Adjust Stock Dialog */}
      <Dialog open={showAdjustDialog} onClose={() => setShowAdjustDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Adjust Stock for {adjustPart?.part_number}</DialogTitle>
        <DialogContent>
          <TextField label="Adjustment Amount" type="number" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Reason" value={adjustReason} onChange={e => setAdjustReason(e.target.value)} fullWidth sx={{ mb: 2 }} required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAdjustDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAdjustStock} variant="contained">Adjust</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
