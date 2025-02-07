import React, { useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, TextField, 
  Button, DialogActions, Box, FormControl, 
  InputLabel, Select, MenuItem 
} from "@mui/material";
import { BASE_URL } from "../../../../config";

const AddEventModal = ({ 
  open, 
  onClose, 
  onSubmitSuccess, 
  initialData = {}, 
  isEditing = false 
}) => {
  const [eventData, setEventData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
    time: initialData.time || "",
    location: initialData.location || "",
    type: initialData.type || "",
    agenda: initialData.agenda ? initialData.agenda.join(", ") : "",
    prizes: initialData.prizes ? initialData.prizes.join(", ") : "",
    giveaways: initialData.giveaways ? initialData.giveaways.join(", ") : "",
    keyTakeaways: initialData.keyTakeaways ? initialData.keyTakeaways.join(", ") : "",
    specialNotes: initialData.specialNotes || "",
  });

  const [image, setImage] = useState(null); // File storage
  const token = localStorage.getItem("token"); // Authentication token

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store selected file
  };

  // API Call - Add Event
  const handleAddEvent = async () => {
    const formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("time", eventData.time);
    formData.append("location", eventData.location);
    formData.append("type", eventData.type);
    formData.append("agenda", eventData.agenda);
    formData.append("prizes", eventData.prizes);
    formData.append("giveaways", eventData.giveaways);
    formData.append("keyTakeaways", eventData.keyTakeaways);
    formData.append("specialNotes", eventData.specialNotes);
    if (image) formData.append("image", image); // Append file

    try {
      const response = await fetch(`${BASE_URL}/event/addEvent`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        onSubmitSuccess();
        onClose();
      } else {
        console.error("Failed to add event");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      console.log(error.message);
    }
  };

  // API Call - Update Event
  const handleUpdateEvent = async () => {
    const formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("time", eventData.time);
    formData.append("location", eventData.location);
    formData.append("type", eventData.type);
    formData.append("agenda", eventData.agenda);
    formData.append("prizes", eventData.prizes);
    formData.append("giveaways", eventData.giveaways);
    formData.append("keyTakeaways", eventData.keyTakeaways);
    formData.append("specialNotes", eventData.specialNotes);
    if (image) formData.append("image", image); // Append file

    try {
      const response = await fetch(`${BASE_URL}/event/updateEvent/${initialData._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        onSubmitSuccess();
        onClose();
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
      <DialogContent>
        <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)" mt={1}>
          <TextField name="name" label="Event Name" value={eventData.name} onChange={handleInputChange} fullWidth required />
          <TextField name="location" label="Location" value={eventData.location} onChange={handleInputChange} fullWidth required />
          <TextField name="description" label="Description" value={eventData.description} onChange={handleInputChange} fullWidth multiline rows={3} required />
          <FormControl fullWidth>
            <InputLabel>Event Type</InputLabel>
            <Select name="type" value={eventData.type} onChange={handleInputChange}>
              <MenuItem value="offline">Offline</MenuItem>
              <MenuItem value="online">Online</MenuItem>
            </Select>
          </FormControl>
          <TextField name="date" label="Date" type="date" value={eventData.date} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth required />
          <TextField name="time" label="Time" type="time" value={eventData.time} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth required />

          {/* File Upload */}
          <Box>
            <label htmlFor="image-upload">
              <input type="file" id="image-upload" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              <Button variant="contained" component="span">Upload Event Image</Button>
              {image && <p>{image.name}</p>}
            </label>
          </Box>

          <TextField name="agenda" label="Agenda (comma-separated)" value={eventData.agenda} onChange={handleInputChange} fullWidth multiline rows={2} />
          <TextField name="prizes" label="Prizes (comma-separated)" value={eventData.prizes} onChange={handleInputChange} fullWidth />
          <TextField name="giveaways" label="Giveaways (comma-separated)" value={eventData.giveaways} onChange={handleInputChange} fullWidth />
          <TextField name="keyTakeaways" label="Key Takeaways (comma-separated)" value={eventData.keyTakeaways} onChange={handleInputChange} fullWidth multiline rows={2} />
          <TextField name="specialNotes" label="Special Notes" value={eventData.specialNotes} onChange={handleInputChange} fullWidth multiline rows={2} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={isEditing ? handleUpdateEvent : handleAddEvent} color="primary">
          {isEditing ? "Update Event" : "Add Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEventModal;
