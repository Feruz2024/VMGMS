import React, { useState, useEffect } from 'react';
import { fetchServices, createService } from './api';
import { Box, Select, MenuItem, InputLabel, FormControl, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, ListSubheader, Checkbox, OutlinedInput } from '@mui/material';


export default function ServiceSelect({ value = [], onChange, label = 'Service/Reason', fullWidth = true }) {
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', default_hours: 1, default_rate: 100, category: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  // Group services by category
  const categorized = services.reduce((acc, s) => {
    const cat = s.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  const handleAddService = async () => {
    setError('');
    if (!newService.name) {
      setError('Service name is required');
      return;
    }
    try {
      const created = await createService(newService);
      setServices([created, ...services]);
      onChange({ target: { value: [...value, created.id], service: created } });
      setOpen(false);
      setNewService({ name: '', description: '', default_hours: 1, default_rate: 100, category: '' });
    } catch (e) {
      setError('Failed to create service');
    }
  };

  const handleChange = (event) => {
    const val = event.target.value;
    if (val.includes("__add_new__")) {
      setOpen(true);
      // Remove the add new option from selection
      onChange({ target: { value: val.filter(v => v !== "__add_new__") } });
    } else {
      onChange(event);
    }
  };

  return (
    <Box>
      <FormControl fullWidth={fullWidth} sx={{ mb: 2 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={value}
          label={label}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) =>
            services.filter(s => selected.includes(s.id)).map(s => s.name).join(', ')
          }
        >
          {Object.entries(categorized).map(([cat, items]) => [
            <ListSubheader key={cat}>{cat}</ListSubheader>,
            ...items.map(s => (
              <MenuItem key={s.id} value={s.id}>
                <Checkbox checked={value.indexOf(s.id) > -1} />
                {s.name}
              </MenuItem>
            ))
          ])}
          <MenuItem value="__add_new__" style={{ fontStyle: 'italic', color: '#1976d2' }}>
            + Add New Service
          </MenuItem>
        </Select>
      </FormControl>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <TextField
            label="Service Name"
            value={newService.name}
            onChange={e => setNewService(s => ({ ...s, name: e.target.value }))}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Category"
            value={newService.category}
            onChange={e => setNewService(s => ({ ...s, category: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            value={newService.description}
            onChange={e => setNewService(s => ({ ...s, description: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Default Hours"
            type="number"
            value={newService.default_hours}
            onChange={e => setNewService(s => ({ ...s, default_hours: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Default Rate"
            type="number"
            value={newService.default_rate}
            onChange={e => setNewService(s => ({ ...s, default_rate: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />
          {error && <Box color="error.main" sx={{ mb: 1 }}>{error}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddService} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
