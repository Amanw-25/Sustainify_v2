import React from "react";
import { Grid, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const DateTimeLocationSection = ({ formData, errors, onInputChange, onDateChange }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} md={4}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Event Date"
            value={formData.date}
            onChange={onDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required
                error={!!errors.date}
                helperText={errors.date}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          name="time"
          label="Event Time"
          placeholder="e.g., 10:00 AM - 2:00 PM"
          fullWidth
          value={formData.time}
          onChange={onInputChange}
          error={!!errors.time}
          helperText={errors.time}
          required
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          name="location"
          label="Location"
          fullWidth
          value={formData.location}
          onChange={onInputChange}
          error={!!errors.location}
          helperText={errors.location}
          required
        />
      </Grid>
    </Grid>
  );
};

export default DateTimeLocationSection;