import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const AddEventModal = ({ open, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "offline",
    host: "",
    agenda: "",
    prizes: "",
    keyTakeaways: "",
    specialNotes: "",
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        agenda: Array.isArray(initialData.agenda) ? initialData.agenda.join(", ") : "",
        prizes: Array.isArray(initialData.prizes) ? initialData.prizes.join(", ") : "",
        keyTakeaways: Array.isArray(initialData.keyTakeaways) ? initialData.keyTakeaways.join(", ") : "",
      });
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSubmit = new FormData();
    
    // Convert comma-separated strings to arrays and add to FormData
    const arrayFields = {
      agenda: formData.agenda.split(",").map(item => item.trim()).filter(Boolean),
      prizes: formData.prizes.split(",").map(item => item.trim()).filter(Boolean),
      keyTakeaways: formData.keyTakeaways.split(",").map(item => item.trim()).filter(Boolean)
    };

    // Add all form fields to FormData
    Object.keys(formData).forEach(key => {
      if (key in arrayFields) {
        formDataToSubmit.append(key, JSON.stringify(arrayFields[key]));
      } else if (key === "image" && formData.image) {
        formDataToSubmit.append("files", formData.image);
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    onSubmit(formDataToSubmit);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? "Edit Event" : "Add New Event"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="file"
                name="image"
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: "image/*" }}
              />
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Event preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'contain',
                    marginTop: '10px'
                  }} 
                />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Event Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="host"
                label="Event Host"
                value={formData.host}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Event Type"
                >
                  <MenuItem value="offline">Offline</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="time"
                label="Time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="agenda"
                label="Agenda (comma-separated)"
                value={formData.agenda}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                helperText="Enter items separated by commas"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="prizes"
                label="Prizes (comma-separated)"
                value={formData.prizes}
                onChange={handleChange}
                fullWidth
                helperText="Enter items separated by commas"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="keyTakeaways"
                label="Key Takeaways (comma-separated)"
                value={formData.keyTakeaways}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                helperText="Enter items separated by commas"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="specialNotes"
                label="Special Notes"
                value={formData.specialNotes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? "Update Event" : "Create Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEventModal;