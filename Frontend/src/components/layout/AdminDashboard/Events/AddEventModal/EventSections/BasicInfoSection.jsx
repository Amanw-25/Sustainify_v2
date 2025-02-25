import React from "react";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

const eventTypes = ["Offline", "Online"];

const BasicInfoSection = ({ formData, errors, onChange }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Basic Information
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          name="name"
          label="Event Name"
          fullWidth
          value={formData.name}
          onChange={onChange}
          error={!!errors.name}
          helperText={errors.name}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.type} required>
          <InputLabel>Event Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={onChange}
            label="Event Type"
          >
            {eventTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
          {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          name="description"
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={formData.description}
          onChange={onChange}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          name="host"
          label="Host/Organizer"
          fullWidth
          value={formData.host}
          onChange={onChange}
          error={!!errors.host}
          helperText={errors.host}
          required
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfoSection;
