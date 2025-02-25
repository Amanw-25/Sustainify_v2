import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import ItemsList from "../ItemsList";

const AdditionalInfoSection = ({ formData, onItemsChange, onInputChange }) => {
  const handleItemsUpdate = (category, items) => {
    onItemsChange(category, items);
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Additional Information
        </Typography>
      </Grid>

      {/* Agenda Items */}
      <Grid item xs={12} md={4}>
        <ItemsList
          title="Agenda Items"
          items={formData.agenda}
          onItemsChange={(items) => handleItemsUpdate('agenda', items)}
        />
      </Grid>

      {/* Prizes */}
      <Grid item xs={12} md={4}>
        <ItemsList
          title="Prizes"
          items={formData.prizes}
          onItemsChange={(items) => handleItemsUpdate('prizes', items)}
        />
      </Grid>

      {/* Key Takeaways */}
      <Grid item xs={12} md={4}>
        <ItemsList
          title="Key Takeaways"
          items={formData.keyTakeaways}
          onItemsChange={(items) => handleItemsUpdate('keyTakeaways', items)}
        />
      </Grid>

      {/* Special Notes */}
      <Grid item xs={12}>
        <TextField
          name="specialNotes"
          label="Special Notes"
          multiline
          rows={3}
          fullWidth
          value={formData.specialNotes}
          onChange={onInputChange}
          placeholder="Any additional information about the event"
        />
      </Grid>
    </Grid>
  );
};

export default AdditionalInfoSection;