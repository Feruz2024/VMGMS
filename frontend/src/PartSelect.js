import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";
import { fetchParts } from "./api";

export default function PartSelect({ value, onChange, label = "Select Part", disabled, showQoh = true }) {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchParts().then(setParts);
  }, []);

  const filtered = parts.filter(
    p =>
      p.part_number.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <TextField
        label={label}
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
        disabled={disabled}
      />
      <Box sx={{ maxHeight: 200, overflowY: "auto", border: 1, borderColor: "#eee", borderRadius: 1 }}>
        {filtered.map(part => (
          <MenuItem
            key={part.id}
            selected={value === part.id}
            onClick={() => onChange(part.id)}
            disabled={disabled}
          >
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{part.part_number} - {part.description}</Typography>
              {showQoh && (
                <Typography variant="caption" color={part.quantity_on_hand <= 0 ? "error" : "text.secondary"}>
                  QoH: {part.quantity_on_hand}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
        {filtered.length === 0 && <Typography variant="body2" sx={{ p: 2 }}>No parts found.</Typography>}
      </Box>
    </Box>
  );
}
