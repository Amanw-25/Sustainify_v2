import React from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  FormHelperText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ImageUploadSection = ({ previewImages, onFileChange, isEditing }) => {
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    onFileChange(files);
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Event Images
        </Typography>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleFileInputChange}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="outlined"
            component="span"
            startIcon={<AddIcon />}
          >
            {isEditing ? "Change Images" : "Upload Images"}
          </Button>
        </label>

        {/* Image Preview */}
        {previewImages.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {previewImages.map((preview, idx) => (
              <Box
                key={idx}
                component="img"
                src={preview}
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid #eee'
                }}
                alt={`Preview ${idx}`}
              />
            ))}
          </Box>
        )}

        {isEditing && (
          <FormHelperText>
            {previewImages.length > 0
              ? "Original images will be kept if no new ones are selected"
              : "Upload new images or keep the original ones"}
          </FormHelperText>
        )}
      </Grid>
    </Grid>
  );
};

export default ImageUploadSection;