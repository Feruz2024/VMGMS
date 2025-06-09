import React, { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ServiceSelect from './ServiceSelect';
import './AppointmentsPage.css';
import { fetchCustomers, fetchVehicles, fetchAppointments, createAppointment, updateAppointment, deleteAppointment } from './api';

export default function AppointmentsPage() {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    customer: '',
    vehicle: '',
    appointment_time: '',
    services: [],
    reason: '',
    technician: '',
    status: 'Booked'
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [statusOptions] = useState([
    'Booked', 'Confirmed', 'Arrived', 'Completed', 'Cancelled', 'No-Show'
  ]);
  const [technicians, setTechnicians] = useState([
    { id: 1, name: 'Tech Mike' },
    { id: 2, name: 'Tech Anna' }
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCustomers().then(setCustomers);
    fetchVehicles().then(setVehicles);
    fetchAppointments().then(data => {
      setEvents(data.map(a => ({
        id: a.id,
        title: `${a.customer_name || ''} - ${a.reason}`,
        start: a.appointment_time,
        end: a.appointment_time,
        backgroundColor: a.status === 'Cancelled' ? '#ccc' : a.status === 'Completed' ? '#4caf50' : '#1976d2',
        extendedProps: a
      })));
    });
  }, []);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setForm(f => ({ ...f, appointment_time: arg.dateStr }));
    setEditingEvent(null);
    setOpenDialog(true);
  };

  const handleEventClick = (info) => {
    const appt = info.event.extendedProps;
    setForm({
      customer: appt.customer,
      vehicle: appt.vehicle,
      appointment_time: appt.appointment_time,
      services: appt.services || [],
      reason: appt.reason,
      technician: appt.technician,
      status: appt.status
    });
    setEditingEvent(appt.id);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    setError(""); setSuccess("");
    if (!form.customer || !form.vehicle || !form.appointment_time || !form.services.length) {
      setError("All fields except technician are required.");
      return;
    }
    try {
      if (editingEvent) {
        await updateAppointment(editingEvent, form);
        setSuccess("Appointment updated.");
      } else {
        await createAppointment(form);
        setSuccess("Appointment created.");
      }
      fetchAppointments().then(data => {
        setEvents(data.map(a => ({
          id: a.id,
          title: `${a.customer_name || ''} - ${a.reason}`,
          start: a.appointment_time,
          end: a.appointment_time,
          backgroundColor: a.status === 'Cancelled' ? '#ccc' : a.status === 'Completed' ? '#4caf50' : '#1976d2',
          extendedProps: a
        })));
      });
      setOpenDialog(false);
      setEditingEvent(null);
      setForm({ customer: '', vehicle: '', appointment_time: '', services: [], reason: '', technician: '', status: 'Booked' });
    } catch (err) {
      setError("Failed to save appointment.");
    }
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await deleteAppointment(editingEvent);
      fetchAppointments().then(data => {
        setEvents(data.map(a => ({
          id: a.id,
          title: `${a.customer_name || ''} - ${a.reason}`,
          start: a.appointment_time,
          end: a.appointment_time,
          backgroundColor: a.status === 'Cancelled' ? '#ccc' : a.status === 'Completed' ? '#4caf50' : '#1976d2',
          extendedProps: a
        })));
      });
      setOpenDialog(false);
      setEditingEvent(null);
      setForm({ customer: '', vehicle: '', appointment_time: '', services: [], reason: '', technician: '', status: 'Booked' });
    } catch (err) {
      setError("Failed to delete appointment.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', mt: 4, width: '100%' }}>
      <Box sx={{ flex: '0 0 60%', pl: 3, pr: 2 }}>
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Appointments Calendar</Typography>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height={390}
            contentHeight={390}
          />
        </Paper>
      </Box>
      <Box sx={{ flex: '0 0 40%', pr: 3 }}>
        <Paper sx={{ p: 2, mb: 4, minHeight: 390, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>Upcoming Appointments</Typography>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {events
              .filter(e => new Date(e.start) >= new Date())
              .sort((a, b) => new Date(a.start) - new Date(b.start))
              .slice(0, 8)
              .map(e => (
                <Box key={e.id} sx={{ mb: 2, p: 1, borderRadius: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2">{new Date(e.start).toLocaleString()}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{e.title}</Typography>
                  <Typography variant="caption" color="text.secondary">Status: {e.extendedProps.status}</Typography>
                </Box>
              ))}
            {events.filter(e => new Date(e.start) >= new Date()).length === 0 && (
              <Typography variant="body2" color="text.secondary">No upcoming appointments.</Typography>
            )}
          </Box>
        </Paper>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEvent ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
        <DialogContent>
          {/* Show related work orders if any */}
          {form.workorders && form.workorders.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="primary">Related Work Order(s):</Typography>
              {form.workorders.map(woId => (
                <Typography key={woId} variant="body2">Work Order #{woId}</Typography>
              ))}
            </Box>
          )}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Customer</InputLabel>
            <Select
              value={form.customer}
              label="Customer"
              onChange={e => setForm(f => ({ ...f, customer: e.target.value, vehicle: '' }))}
            >
              {customers.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Vehicle</InputLabel>
            <Select
              value={form.vehicle}
              label="Vehicle"
              onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))}
            >
              {vehicles.filter(v => !form.customer || v.customer === Number(form.customer)).map(v => (
                <MenuItem key={v.id} value={v.id}>{`${v.make} ${v.model} (${v.license_plate})`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date & Time"
            type="datetime-local"
            value={form.appointment_time}
            onChange={e => setForm(f => ({ ...f, appointment_time: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <ServiceSelect
            value={form.services}
            onChange={e => setForm(f => ({ ...f, services: e.target.value }))}
            label="Service(s)/Reason(s)"
            fullWidth
          />
          <TextField
            label="Additional Notes (optional)"
            value={form.reason}
            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Technician</InputLabel>
            <Select
              value={form.technician}
              label="Technician"
              onChange={e => setForm(f => ({ ...f, technician: e.target.value }))}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {technicians.map(t => (
                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
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
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mb: 1 }}>{success}</Typography>}
        </DialogContent>
        <DialogActions>
          {editingEvent && <Button onClick={handleDelete} color="error">Delete</Button>}
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>{editingEvent ? 'Save Changes' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
