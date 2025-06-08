import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Paper, MenuItem, Select, InputLabel, FormControl, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox
} from "@mui/material";
import { fetchCustomers, fetchVehicles, fetchWorkOrders, createWorkOrder, createCustomer, createVehicle, fetchServices, createService, createWorkOrderItem, updateWorkOrder, deleteWorkOrder } from './api';

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
    services: [],
    createdDate: new Date().toISOString().slice(0, 10),
    deadlineDate: "",
    technician: "",
    status: "New",
    complaint: ""
  });
  const [allServices, setAllServices] = useState([]);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', default_hours: '', default_rate: '' });
  const [serviceError, setServiceError] = useState('');
  const [serviceLoading, setServiceLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [workorders, setWorkorders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    license_plate: '',
    color: '',
    engine: '',
    notes: '',
    customer: ''
  });
  const [vehicleError, setVehicleError] = useState('');
  const [vehicleLoading, setVehicleLoading] = useState(false);

  const handleNewVehicleChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    setVehicleError('');
    if (!newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.vin || !newVehicle.license_plate) {
      setVehicleError('Make, Model, Year, VIN, and License Plate are required.');
      return;
    }
    setVehicleLoading(true);
    try {
      const vehicleToCreate = { ...newVehicle, customer: customerId };
      const created = await createVehicle(vehicleToCreate);
      setVehicles([created, ...vehicles]);
      setVehicleId(created.id);
      setShowVehicleDialog(false);
      setNewVehicle({ make: '', model: '', year: '', vin: '', license_plate: '', color: '', engine: '', notes: '', customer: '' });
    } catch (err) {
      setVehicleError('Failed to create vehicle.');
    } finally {
      setVehicleLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers().then(setCustomers);
    fetchVehicles().then(setVehicles);
    fetchWorkOrders().then(setWorkorders);
    fetchServices().then(setAllServices);
  }, []);

  // Filter vehicles by selected customer
  const filteredVehicles = vehicles.filter(v => !customerId || v.customer === Number(customerId));

  // Replace complaint in form state with an array
  const [complaints, setComplaints] = useState([""]);
  // Add state for complaint dialog
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  // Add state for service dialog
  const [showServiceDialogView, setShowServiceDialogView] = useState(false);
  const [serviceListView, setServiceListView] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!customerId || !vehicleId || form.services.length === 0 || !form.createdDate || !form.deadlineDate || !form.technician || !form.status) {
      setError("All fields except complaint are required, and at least one service must be selected.");
      return;
    }
    try {
      const newWO = await createWorkOrder({
        customer: customerId,
        vehicle: vehicleId,
        created_at: form.createdDate,
        deadline: form.deadlineDate,
        technician: form.technician,
        status: form.status,
        customer_complaint: complaints.filter(c => c.trim()).join("\n")
      });
      // Create WorkOrderItems for each selected service
      for (const sid of form.services) {
        const svc = allServices.find(s => s.id === sid);
        if (svc) {
          await createWorkOrderItem({
            work_order: newWO.id,
            item_type: 'LABOR',
            description: svc.name,
            quantity: svc.default_hours || 1,
            unit_price: svc.default_rate || 0,
            catalog_service: svc.id
          });
        }
      }
      setWorkorders([newWO, ...workorders]);
      setSuccess("Work order created successfully!");
      setForm({ services: [], createdDate: new Date().toISOString().slice(0, 10), deadlineDate: "", technician: "", status: "New", complaint: "" });
      setCustomerId("");
      setVehicleId("");
      setComplaints([""]);
    } catch (err) {
      setError("Failed to create work order.");
    }
  };

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    primary_phone: '',
    email: '',
    telegram: '',
    whatsapp: '',
    address: '',
    notes: ''
  });
  const [customerError, setCustomerError] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);

  const handleNewCustomerChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setCustomerError('');
    if (!newCustomer.name || !newCustomer.primary_phone) {
      setCustomerError('Customer name and phone are required.');
      return;
    }
    setCustomerLoading(true);
    try {
      const created = await createCustomer(newCustomer);
      setCustomers([created, ...customers]);
      setCustomerId(created.id);
      setShowCustomerDialog(false);
      setNewCustomer({ name: '', primary_phone: '', email: '', telegram: '', whatsapp: '', address: '', notes: '' });
    } catch (err) {
      setCustomerError('Failed to create customer.');
    } finally {
      setCustomerLoading(false);
    }
  };

  // Add state for editing work order
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editWorkOrder, setEditWorkOrder] = useState(null);

  const handleEditClick = (wo) => {
    setEditWorkOrder(wo);
    setEditDialogOpen(true);
  };

  const handleEditSave = async (updatedFields) => {
    if (!editWorkOrder) return;
    try {
      const updated = await updateWorkOrder(editWorkOrder.id, {
        customer: editWorkOrder.customer,
        vehicle: editWorkOrder.vehicle,
        customer_complaint: editWorkOrder.customer_complaint || '',
        ...updatedFields
      });
      setWorkorders(wos => wos.map(w => w.id === updated.id ? updated : w));
      setEditDialogOpen(false);
      setEditWorkOrder(null);
      setSuccess('Work order updated successfully!');
    } catch (err) {
      setError('Failed to update work order.');
    }
  };

  const handleDeleteClick = async (wo) => {
    if (!window.confirm('Are you sure you want to delete this work order?')) return;
    try {
      await deleteWorkOrder(wo.id);
      setWorkorders(wos => wos.filter(w => w.id !== wo.id));
      setSuccess('Work order deleted successfully!');
    } catch (err) {
      setError('Failed to delete work order.');
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAllRows = (checked) => {
    if (checked) {
      setSelectedRows(filteredWorkorders.map((wo) => wo.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleMasterDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the selected work orders?')) return;
    try {
      await Promise.all(selectedRows.map(id => deleteWorkOrder(id)));
      setWorkorders(wos => wos.filter(w => !selectedRows.includes(w.id)));
      setSelectedRows([]);
      setSuccess('Selected work orders deleted successfully!');
    } catch (err) {
      setError('Failed to delete selected work orders.');
    }
  };

  const filteredWorkorders = workorders.filter(wo => {
    const searchText = search.toLowerCase();
    if (!showCancelled && wo.status && wo.status.toLowerCase() === 'cancelled') return false;
    return (
      (wo.customer_name || '').toLowerCase().includes(searchText) ||
      (wo.vehicle_display || '').toLowerCase().includes(searchText) ||
      (wo.status || '').toLowerCase().includes(searchText) ||
      (wo.technician_name || '').toLowerCase().includes(searchText)
    );
  });

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', position: 'relative', left: '50%', right: '50%', mx: 0, px: 0, mt: 0, transform: 'translate(-50%, 0)' }}>
      <Dialog open={showCustomerDialog} onClose={() => setShowCustomerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <form onSubmit={handleCreateCustomer}>
          <DialogContent>
            <TextField label="Customer Name" name="name" value={newCustomer.name} onChange={handleNewCustomerChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Phone" name="primary_phone" value={newCustomer.primary_phone} onChange={handleNewCustomerChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Email" name="email" value={newCustomer.email} onChange={handleNewCustomerChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Telegram" name="telegram" value={newCustomer.telegram} onChange={handleNewCustomerChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="WhatsApp" name="whatsapp" value={newCustomer.whatsapp} onChange={handleNewCustomerChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Address" name="address" value={newCustomer.address} onChange={handleNewCustomerChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Notes" name="notes" value={newCustomer.notes} onChange={handleNewCustomerChange} fullWidth multiline minRows={2} sx={{ mb: 2 }} />
            {customerError && <Alert severity="error">{customerError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCustomerDialog(false)} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={customerLoading}>{customerLoading ? 'Saving...' : 'Add Customer'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={showVehicleDialog} onClose={() => setShowVehicleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <form onSubmit={handleCreateVehicle}>
          <DialogContent>
            <TextField label="Make" name="make" value={newVehicle.make} onChange={handleNewVehicleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Model" name="model" value={newVehicle.model} onChange={handleNewVehicleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Year" name="year" value={newVehicle.year} onChange={handleNewVehicleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="VIN" name="vin" value={newVehicle.vin} onChange={handleNewVehicleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="License Plate" name="license_plate" value={newVehicle.license_plate} onChange={handleNewVehicleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Color" name="color" value={newVehicle.color} onChange={handleNewVehicleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Engine Size" name="engine" value={newVehicle.engine} onChange={handleNewVehicleChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Notes" name="notes" value={newVehicle.notes} onChange={handleNewVehicleChange} fullWidth multiline minRows={2} sx={{ mb: 2 }} />
            {vehicleError && <Alert severity="error">{vehicleError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowVehicleDialog(false)} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={vehicleLoading}>{vehicleLoading ? 'Saving...' : 'Add Vehicle'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={showServiceDialog} onClose={() => setShowServiceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Services</DialogTitle>
        <DialogContent>
          {/* Group services by category and sort alphabetically */}
          {(() => {
            const grouped = {};
            allServices.forEach(svc => {
              const cat = svc.category || 'Uncategorized';
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push(svc);
            });
            const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
            return (
              <>
                {sortedCategories.map(category => (
                  <Box key={category} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>{category}</Typography>
                    {grouped[category]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(svc => (
                        <Box key={svc.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <input
                            type="checkbox"
                            checked={form.services.includes(svc.id)}
                            onChange={e => {
                              setForm(f => ({
                                ...f,
                                services: e.target.checked
                                  ? [...f.services, svc.id]
                                  : f.services.filter(id => id !== svc.id)
                              }));
                            }}
                          />
                          <Typography sx={{ ml: 1 }}>{svc.name}</Typography>
                        </Box>
                      ))}
                  </Box>
                ))}
              </>
            );
          })()}
          <Button variant="text" onClick={() => setNewService({ name: '', description: '', default_hours: '', default_rate: '' })} sx={{ mt: 2 }}>
            + Add New Service
          </Button>
          {newService.name !== '' && (
            <Box sx={{ mt: 2 }}>
              <TextField label="Service Name" name="name" value={newService.name} onChange={e => setNewService(ns => ({ ...ns, name: e.target.value }))} fullWidth required sx={{ mb: 1 }} />
              <TextField label="Description" name="description" value={newService.description} onChange={e => setNewService(ns => ({ ...ns, description: e.target.value }))} fullWidth sx={{ mb: 1 }} />
              <TextField label="Default Hours" name="default_hours" value={newService.default_hours} onChange={e => setNewService(ns => ({ ...ns, default_hours: e.target.value }))} fullWidth required sx={{ mb: 1 }} />
              <TextField label="Default Rate" name="default_rate" value={newService.default_rate} onChange={e => setNewService(ns => ({ ...ns, default_rate: e.target.value }))} fullWidth required sx={{ mb: 1 }} />
              {serviceError && <Alert severity="error">{serviceError}</Alert>}
              <Button variant="contained" color="primary" disabled={serviceLoading} onClick={async () => {
                setServiceError('');
                setServiceLoading(true);
                try {
                  const created = await createService(newService);
                  setAllServices(svcs => [created, ...svcs]);
                  setForm(f => ({ ...f, services: [...f.services, created.id] }));
                  setNewService({ name: '', description: '', default_hours: '', default_rate: '' });
                } catch (err) {
                  setServiceError('Failed to create service.');
                } finally {
                  setServiceLoading(false);
                }
              }}>
                Save Service
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowServiceDialog(false)} color="secondary">Done</Button>
        </DialogActions>
      </Dialog>
      {/* Complaint dialog */}
      <Dialog open={showComplaintDialog} onClose={() => setShowComplaintDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Customer Complaints</DialogTitle>
        <DialogContent>
          {complaints.map((c, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ mr: 1 }}>{idx + 1}.</Typography>
              <TextField
                value={c}
                onChange={e => {
                  const newArr = [...complaints];
                  newArr[idx] = e.target.value;
                  setComplaints(newArr);
                }}
                size="small"
                fullWidth
                placeholder={`Complaint #${idx + 1}`}
              />
              {complaints.length > 1 && (
                <Button onClick={() => setComplaints(complaints.filter((_, i) => i !== idx))} color="error" sx={{ ml: 1, minWidth: 0, px: 1 }}>-</Button>
              )}
            </Box>
          ))}
          <Button onClick={() => setComplaints([...complaints, ""])} sx={{ mt: 1 }} size="small">+ Add Complaint</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowComplaintDialog(false)} color="secondary">Done</Button>
        </DialogActions>
      </Dialog>
      {/* Service details dialog */}
      <Dialog open={showServiceDialogView} onClose={() => setShowServiceDialogView(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Services</DialogTitle>
        <DialogContent>
          {serviceListView.length > 0 ? (
            serviceListView.map((svc, idx) => (
              <Typography key={idx}>{idx + 1}. {svc}</Typography>
            ))
          ) : (
            <Typography>No services listed.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowServiceDialogView(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ width: '100%', p: { xs: 2, sm: 4 }, mb: 4, boxShadow: 3, borderRadius: 0, bgcolor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom align="center">Create Work Order</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container direction="column" spacing={2} sx={{ width: '100%', margin: 0, alignItems: 'center', justifyContent: 'center' }}>
            {/* Row 1 */}
            <Grid container item direction="row" wrap="wrap" spacing={2} xs={12} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={3} lg={2.5}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Customer</InputLabel>
                  <Select
                    value={customerId}
                    label="Customer"
                    onChange={e => {
                      if (e.target.value === 'new') {
                        setShowCustomerDialog(true);
                        setCustomerId("");
                      } else {
                        setCustomerId(e.target.value);
                      }
                    }}
                    sx={{ minWidth: 220, maxWidth: 400 }}
                  >
                    {customers.map(c => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                    <MenuItem value="new">
                      + New Customer
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} lg={2.5}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Vehicle</InputLabel>
                  <Select
                    value={vehicleId}
                    label="Vehicle"
                    onChange={e => {
                      if (e.target.value === 'new') {
                        setShowVehicleDialog(true);
                        setVehicleId("");
                        setNewVehicle(v => ({ ...v, customer: customerId }));
                      } else {
                        setVehicleId(e.target.value);
                      }
                    }}
                    disabled={!customerId}
                    sx={{ minWidth: 220, maxWidth: 400 }}
                  >
                    {filteredVehicles.map(v => (
                      <MenuItem key={v.id} value={v.id}>{`${v.make || v.brand} ${v.model} (${v.license_plate || v.license})`}</MenuItem>
                    ))}
                    <MenuItem value="new">
                      + New Vehicle
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2} lg={1.5}>
                <TextField label="Created By" value="Admin" fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ minWidth: 120, maxWidth: 200 }} />
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
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
              {/* <Grid item xs={12} md={2} lg={3.5}>
                <TextField label="Customer Complaints" value={complaints.join(', ')} fullWidth margin="normal" InputProps={{ readOnly: true }} sx={{ minWidth: 120, maxWidth: 200 }} />
              </Grid> */}
              <Grid item xs={12} md={2} lg={3.5}>
                <Button variant="outlined" fullWidth onClick={() => setShowComplaintDialog(true)}>
                  {complaints.filter(c => c.trim()).length > 0 ? `View Complaints (${complaints.filter(c => c.trim()).length})` : 'Add Complaints'}
                </Button>
              </Grid>
            </Grid>
            {/* Row 2 */}
            <Grid container item direction="row" wrap="wrap" spacing={2} xs={12} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={5} lg={5}>
                <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => setShowServiceDialog(true)}>
                  {form.services.length > 0 ? `Selected Services (${form.services.length})` : 'Select Services'}
                </Button>
                <Box sx={{ mt: 1 }}>
                  {/* Hide selected services from the form, only show in popup */}
                </Box>
              </Grid>
              <Grid item xs={12} md={3} lg={3}>
                <TextField label="Deadline Date" type="date" fullWidth margin="normal" value={form.deadlineDate} onChange={e => setForm(f => ({ ...f, deadlineDate: e.target.value }))} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Assigned To</InputLabel>
                  <Select
                    value={form.technician}
                    label="Assigned To"
                    onChange={e => setForm(f => ({ ...f, technician: e.target.value }))}
                    sx={{ minWidth: 220, maxWidth: 400 }}
                  >
                    {techniciansList.map(t => (
                      <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {/* Row 3 */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="contained" color="primary" type="submit" sx={{ width: { xs: '100%', md: 'auto' }, py: 1.5, fontSize: '1.1rem' }}>Create Work Order</Button>
            </Grid>
          </Grid>
        </form>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Paper>
      <Paper sx={{ width: '100%', p: { xs: 1, sm: 2 }, boxShadow: 2, borderRadius: 0 }}>
        <Typography variant="h6" gutterBottom>Work Orders List</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Checkbox
            indeterminate={selectedRows.length > 0 && selectedRows.length < filteredWorkorders.length}
            checked={filteredWorkorders.length > 0 && selectedRows.length === filteredWorkorders.length}
            onChange={e => handleSelectAllRows(e.target.checked)}
            color="primary"
          />
          <Typography variant="body2" sx={{ ml: 1, mr: 2 }}>Select All</Typography>
          <TextField
            label="Search Work Orders"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 220, mr: 2 }}
          />
          <Button
            variant="contained"
            color="error"
            disabled={selectedRows.length === 0}
            onClick={handleMasterDelete}
            sx={{ mr: 2 }}
          >
            Delete Selected
          </Button>
          <FormControl sx={{ minWidth: 180 }} size="small">
            <Select
              value={showCancelled ? 'all' : 'active'}
              onChange={e => setShowCancelled(e.target.value === 'all')}
            >
              <MenuItem value="active">Show Active Only</MenuItem>
              <MenuItem value="all">Show All (Including Cancelled)</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < filteredWorkorders.length}
                    checked={filteredWorkorders.length > 0 && selectedRows.length === filteredWorkorders.length}
                    onChange={e => handleSelectAllRows(e.target.checked)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Technician</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Complaints</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWorkorders.map((wo) => (
                <TableRow key={wo.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(wo.id)}
                      onChange={() => handleSelectRow(wo.id)}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{wo.id}</TableCell>
                  <TableCell>{wo.customer_name || wo.customer}</TableCell>
                  <TableCell>{wo.vehicle_display || wo.vehicle}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => {
                        setServiceListView(wo.service_names || []);
                        setShowServiceDialogView(true);
                      }}
                    >
                      View{wo.service_names && wo.service_names.length > 0 ? ` (${wo.service_names.length})` : ''}
                    </Button>
                  </TableCell>
                  <TableCell>{wo.status}</TableCell>
                  <TableCell>{wo.technician_name || wo.technician}</TableCell>
                  <TableCell>{wo.created_at || wo.createdDate}</TableCell>
                  <TableCell>{wo.deadline || wo.deadlineDate}</TableCell>
                  <TableCell>
                    {wo.customer_complaint ? (
                      <Button variant="text" size="small" onClick={() => {
                        setComplaints(wo.customer_complaint.split('\n'));
                        setShowComplaintDialog(true);
                      }}>
                        View ({wo.customer_complaint.split('\n').filter(c => c.trim()).length})
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">None</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditClick(wo)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(wo)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Edit Work Order Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Work Order</DialogTitle>
        <form onSubmit={e => {
          e.preventDefault();
          handleEditSave({
            status: form.status,
            technician: form.technician,
            deadlineDate: form.deadlineDate,
            services: form.services
          });
        }}>
          <DialogContent>
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={form.technician}
                label="Assigned To"
                onChange={e => setForm(f => ({ ...f, technician: e.target.value }))}
                sx={{ minWidth: 220, maxWidth: 400 }}
              >
                {techniciansList.map(t => (
                  <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Deadline Date" type="date" fullWidth margin="normal" value={form.deadlineDate} onChange={e => setForm(f => ({ ...f, deadlineDate: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Save Changes</Button>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
    </Box>
  );
}
