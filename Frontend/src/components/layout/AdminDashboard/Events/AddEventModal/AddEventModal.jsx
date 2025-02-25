// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Grid,
//   Typography,
//   Box,
//   InputAdornment,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   FormHelperText,
//   IconButton,
//   Chip,
//   Paper,
// } from "@mui/material";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";

// const eventTypes = [
//   "Offline",
//   "Online"
// ];

// const AddEventModal = ({ open, onClose, onSubmit, initialData, isEditing }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     date: null,
//     time: "",
//     location: "",
//     type: "",
//     host: "",
//     agenda: [],
//     prizes: [],
//     keyTakeaways: [],
//     specialNotes: "",
//   });

//   const [newItem, setNewItem] = useState({
//     agenda: "",
//     prizes: "",
//     keyTakeaways: "",
//   });

//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [previewImages, setPreviewImages] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (isEditing && initialData) {
//       const dateObj = initialData.date ? new Date(initialData.date) : null;

//       setFormData({
//         name: initialData.name || "",
//         description: initialData.description || "",
//         date: dateObj,
//         time: initialData.time || "",
//         location: initialData.location || "",
//         type: initialData.type || "",
//         host: initialData.host || "",
//         agenda: initialData.agenda || [],
//         prizes: initialData.prizes || [],
//         keyTakeaways: initialData.keyTakeaways || [],
//         specialNotes: initialData.specialNotes || "",
//       });

//       if (initialData.image) {
//         setPreviewImages(Array.isArray(initialData.image) ? initialData.image : [initialData.image]);
//       }
//     }
//   }, [isEditing, initialData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };

//   const handleDateChange = (date) => {
//     setFormData({ ...formData, date });
//     if (errors.date) {
//       setErrors({ ...errors, date: null });
//     }
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);

//     if (files.length > 0) {
//       setSelectedFiles(files);

//       const newPreviews = files.map(file => URL.createObjectURL(file));

//       previewImages.forEach(url => {
//         if (url.startsWith('blob:')) {
//           URL.revokeObjectURL(url);
//         }
//       });

//       setPreviewImages(newPreviews);
//     }
//   };

//   const handleItemChange = (category, value) => {
//     setNewItem({ ...newItem, [category]: value });
//   };

//   const addItem = (category) => {
//     if (newItem[category].trim()) {
//       setFormData({
//         ...formData,
//         [category]: [...formData[category], newItem[category].trim()],
//       });
//       setNewItem({ ...newItem, [category]: "" });
//     }
//   };

//   const removeItem = (category, index) => {
//     const updatedItems = [...formData[category]];
//     updatedItems.splice(index, 1);
//     setFormData({ ...formData, [category]: updatedItems });
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.description.trim()) newErrors.description = "Description is required";
//     if (!formData.date) newErrors.date = "Date is required";
//     if (!formData.time.trim()) newErrors.time = "Time is required";
//     if (!formData.location.trim()) newErrors.location = "Location is required";
//     if (!formData.type.trim()) newErrors.type = "Event type is required";
//     if (!formData.host.trim()) newErrors.host = "Host is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     try {
//       const submitFormData = new FormData();

//       Object.keys(formData).forEach(key => {
//         if (key === 'date' && formData[key]) {
//           const dateObj = new Date(formData[key]);
//           const formattedDate = dateObj.toISOString().split('T')[0];
//           submitFormData.append(key, formattedDate);
//         } else if (Array.isArray(formData[key])) {
//           submitFormData.append(key, JSON.stringify(formData[key]));
//         } else if (formData[key] !== null && formData[key] !== undefined) {
//           submitFormData.append(key, formData[key]);
//         }
//       });

//       if (selectedFiles.length > 0) {
//         selectedFiles.forEach(file => {
//           submitFormData.append("image", file);
//         });
//       }


//       await onSubmit(submitFormData);
//     } catch (error) {
//       console.error("Form submission error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       previewImages.forEach(url => {
//         if (url.startsWith('blob:')) {
//           URL.revokeObjectURL(url);
//         }
//       });
//     };
//   }, [previewImages]);

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{ sx: { borderRadius: 2 } }}
//     >
//       <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h5" fontWeight="bold" color="primary">
//           {isEditing ? "Edit Event" : "Add New Event"}
//         </Typography>
//         <IconButton onClick={onClose} size="small">
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             {/* Basic Info Section */}
//             <Grid item xs={12}>
//               <Typography variant="h6" color="textSecondary" gutterBottom>
//                 Basic Information
//               </Typography>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 name="name"
//                 label="Event Name"
//                 fullWidth
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 error={!!errors.name}
//                 helperText={errors.name}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <FormControl fullWidth error={!!errors.type} required>
//                 <InputLabel>Event Type</InputLabel>
//                 <Select
//                   name="type"
//                   value={formData.type}
//                   onChange={handleInputChange}
//                   label="Event Type"
//                 >
//                   {eventTypes.map(type => (
//                     <MenuItem key={type} value={type}>{type}</MenuItem>
//                   ))}
//                 </Select>
//                 {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 name="description"
//                 label="Description"
//                 multiline
//                 rows={4}
//                 fullWidth
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 error={!!errors.description}
//                 helperText={errors.description}
//                 required
//               />
//             </Grid>

//             {/* Date, Time & Location */}
//             <Grid item xs={12} md={4}>
//               <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <DatePicker
//                   label="Event Date"
//                   value={formData.date}
//                   onChange={handleDateChange}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       fullWidth
//                       required
//                       error={!!errors.date}
//                       helperText={errors.date}
//                     />
//                   )}
//                 />
//               </LocalizationProvider>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 name="time"
//                 label="Event Time"
//                 placeholder="e.g., 10:00 AM - 2:00 PM"
//                 fullWidth
//                 value={formData.time}
//                 onChange={handleInputChange}
//                 error={!!errors.time}
//                 helperText={errors.time}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 name="location"
//                 label="Location"
//                 fullWidth
//                 value={formData.location}
//                 onChange={handleInputChange}
//                 error={!!errors.location}
//                 helperText={errors.location}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 name="host"
//                 label="Host/Organizer"
//                 fullWidth
//                 value={formData.host}
//                 onChange={handleInputChange}
//                 error={!!errors.host}
//                 helperText={errors.host}
//                 required
//               />
//             </Grid>

//             {/* Image Upload */}
//             <Grid item xs={12}>
//               <Typography variant="h6" color="textSecondary" gutterBottom>
//                 Event Images
//               </Typography>
//               <input
//                 accept="image/*"
//                 style={{ display: 'none' }}
//                 id="raised-button-file"
//                 multiple
//                 type="file"
//                 onChange={handleFileChange}
//               />
//               <label htmlFor="raised-button-file">
//                 <Button
//                   variant="outlined"
//                   component="span"
//                   startIcon={<AddIcon />}
//                 >
//                   {isEditing ? "Change Images" : "Upload Images"}
//                 </Button>
//               </label>

//               {/* Image Preview */}
//               {previewImages.length > 0 && (
//                 <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                   {previewImages.map((preview, idx) => (
//                     <Box
//                       key={idx}
//                       component="img"
//                       src={preview}
//                       sx={{
//                         width: 100,
//                         height: 100,
//                         objectFit: 'cover',
//                         borderRadius: 1,
//                         border: '1px solid #eee'
//                       }}
//                       alt={`Preview ${idx}`}
//                     />
//                   ))}
//                 </Box>
//               )}

//               {isEditing && selectedFiles.length === 0 && (
//                 <FormHelperText>
//                   {previewImages.length > 0
//                     ? "Original images will be kept if no new ones are selected"
//                     : "Upload new images or keep the original ones"}
//                 </FormHelperText>
//               )}
//             </Grid>

//             {/* Additional Info Sections */}
//             <Grid item xs={12}>
//               <Typography variant="h6" color="textSecondary" gutterBottom>
//                 Additional Information
//               </Typography>
//             </Grid>

//             {/* Agenda Items */}
//             <Grid item xs={12} md={4}>
//               <Typography variant="subtitle1" gutterBottom>
//                 Agenda Items
//               </Typography>
//               <Box sx={{ display: 'flex', mb: 1 }}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Add agenda item"
//                   value={newItem.agenda}
//                   onChange={(e) => handleItemChange('agenda', e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && addItem('agenda')}
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ ml: 1 }}
//                   onClick={() => addItem('agenda')}
//                 >
//                   Add
//                 </Button>
//               </Box>
//               <Paper
//                 variant="outlined"
//                 sx={{
//                   p: 1,
//                   minHeight: '100px',
//                   maxHeight: '150px',
//                   overflowY: 'auto'
//                 }}
//               >
//                 {formData.agenda.length > 0 ? (
//                   formData.agenda.map((item, idx) => (
//                     <Chip
//                       key={idx}
//                       label={item}
//                       onDelete={() => removeItem('agenda', idx)}
//                       sx={{ m: 0.5 }}
//                     />
//                   ))
//                 ) : (
//                   <Typography color="text.secondary" align="center" sx={{ pt: 2 }}>
//                     No agenda items added
//                   </Typography>
//                 )}
//               </Paper>
//             </Grid>

//             {/* Prizes */}
//             <Grid item xs={12} md={4}>
//               <Typography variant="subtitle1" gutterBottom>
//                 Prizes
//               </Typography>
//               <Box sx={{ display: 'flex', mb: 1 }}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Add prize"
//                   value={newItem.prizes}
//                   onChange={(e) => handleItemChange('prizes', e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && addItem('prizes')}
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ ml: 1 }}
//                   onClick={() => addItem('prizes')}
//                 >
//                   Add
//                 </Button>
//               </Box>
//               <Paper
//                 variant="outlined"
//                 sx={{
//                   p: 1,
//                   minHeight: '100px',
//                   maxHeight: '150px',
//                   overflowY: 'auto'
//                 }}
//               >
//                 {formData.prizes.length > 0 ? (
//                   formData.prizes.map((item, idx) => (
//                     <Chip
//                       key={idx}
//                       label={item}
//                       onDelete={() => removeItem('prizes', idx)}
//                       sx={{ m: 0.5 }}
//                     />
//                   ))
//                 ) : (
//                   <Typography color="text.secondary" align="center" sx={{ pt: 2 }}>
//                     No prizes added
//                   </Typography>
//                 )}
//               </Paper>
//             </Grid>

//             {/* Key Takeaways */}
//             <Grid item xs={12} md={4}>
//               <Typography variant="subtitle1" gutterBottom>
//                 Key Takeaways
//               </Typography>
//               <Box sx={{ display: 'flex', mb: 1 }}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="Add key takeaway"
//                   value={newItem.keyTakeaways}
//                   onChange={(e) => handleItemChange('keyTakeaways', e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && addItem('keyTakeaways')}
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ ml: 1 }}
//                   onClick={() => addItem('keyTakeaways')}
//                 >
//                   Add
//                 </Button>
//               </Box>
//               <Paper
//                 variant="outlined"
//                 sx={{
//                   p: 1,
//                   minHeight: '100px',
//                   maxHeight: '150px',
//                   overflowY: 'auto'
//                 }}
//               >
//                 {formData.keyTakeaways.length > 0 ? (
//                   formData.keyTakeaways.map((item, idx) => (
//                     <Chip
//                       key={idx}
//                       label={item}
//                       onDelete={() => removeItem('keyTakeaways', idx)}
//                       sx={{ m: 0.5 }}
//                     />
//                   ))
//                 ) : (
//                   <Typography color="text.secondary" align="center" sx={{ pt: 2 }}>
//                     No key takeaways added
//                   </Typography>
//                 )}
//               </Paper>
//             </Grid>

//             {/* Special Notes */}
//             <Grid item xs={12}>
//               <TextField
//                 name="specialNotes"
//                 label="Special Notes"
//                 multiline
//                 rows={3}
//                 fullWidth
//                 value={formData.specialNotes}
//                 onChange={handleInputChange}
//                 placeholder="Any additional information about the event"
//               />
//             </Grid>
//           </Grid>
//         </form>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, py: 2 }}>
//         <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color="primary"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddEventModal;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BasicInfoSection from "./EventSections/BasicInfoSection";
import DateTimeLocationSection from "./EventSections/DateTimeLocationSection";
import ImageUploadSection from "./EventSections/ImageUploadSection";
import AdditionalInfoSection from "./EventSections/AdditionalInfoSection";

const AddEventModal = ({ open, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: null,
    time: "",
    location: "",
    type: "",
    host: "",
    agenda: [],
    prizes: [],
    keyTakeaways: [],
    specialNotes: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && initialData) {
      const dateObj = initialData.date ? new Date(initialData.date) : null;

      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        date: dateObj,
        time: initialData.time || "",
        location: initialData.location || "",
        type: initialData.type || "",
        host: initialData.host || "",
        agenda: initialData.agenda || [],
        prizes: initialData.prizes || [],
        keyTakeaways: initialData.keyTakeaways || [],
        specialNotes: initialData.specialNotes || "",
      });

      if (initialData.image) {
        setPreviewImages(Array.isArray(initialData.image) ? initialData.image : [initialData.image]);
      }
    }
  }, [isEditing, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
    if (errors.date) {
      setErrors({ ...errors, date: null });
    }
  };

  const handleFileChange = (files) => {
    if (files.length > 0) {
      setSelectedFiles(files);
      const newPreviews = files.map(file => URL.createObjectURL(file));

      previewImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });

      setPreviewImages(newPreviews);
    }
  };

  const handleItemChange = (category, items) => {
    setFormData({
      ...formData,
      [category]: items,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time.trim()) newErrors.time = "Time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.type.trim()) newErrors.type = "Event type is required";
    if (!formData.host.trim()) newErrors.host = "Host is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'date' && formData[key]) {
          const dateObj = new Date(formData[key]);
          const formattedDate = dateObj.toISOString().split('T')[0];
          submitFormData.append(key, formattedDate);
        } else if (Array.isArray(formData[key])) {
          submitFormData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitFormData.append(key, formData[key]);
        }
      });

      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          submitFormData.append("image", file);
        });
      }

      await onSubmit(submitFormData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewImages]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          {isEditing ? "Edit Event" : "Add New Event"}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <BasicInfoSection 
            formData={formData} 
            errors={errors} 
            onChange={handleInputChange} 
          />
          
          <DateTimeLocationSection 
            formData={formData} 
            errors={errors} 
            onInputChange={handleInputChange} 
            onDateChange={handleDateChange} 
          />
          
          <ImageUploadSection 
            previewImages={previewImages} 
            onFileChange={handleFileChange} 
            isEditing={isEditing} 
          />
          
          <AdditionalInfoSection 
            formData={formData} 
            onItemsChange={handleItemChange} 
            onInputChange={handleInputChange} 
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEventModal;