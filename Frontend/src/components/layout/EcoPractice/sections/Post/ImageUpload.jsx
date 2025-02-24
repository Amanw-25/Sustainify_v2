import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { styles } from './styles.jsx';
import uplaodImageToCloudinary from '../../../../../utils/uploadCloudinary.js';

const ImageUpload = ({ postData, setPostData }) => {
  const [isUploading, setIsUploading] = useState(false);
  const draftId = localStorage.getItem("draft-id");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPostData(prev => ({ ...prev, previewImage: reader.result }));
        };
        reader.readAsDataURL(file);

        const uploadedImage = await uplaodImageToCloudinary(file);
        
        const updatedPostData = {
          ...postData,
          previewImage: uploadedImage.secure_url
        };
        
        setPostData(updatedPostData);

        if (draftId) {
          localStorage.setItem(draftId, JSON.stringify(updatedPostData));
        }

      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Box sx={styles.imageSection}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
        Story Preview
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <img 
          src={postData.previewImage || 'https://sb.ecobnb.net/app/uploads/sites/3/2023/05/Green-Blogging-How-to-Start-a-Sustainable-Living-Blog-1-1170x490.jpg'} 
          alt="Preview" 
          style={styles.previewImg}
        />
        {isUploading && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: 2,
            borderRadius: '50%'
          }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
      <Button
        variant="outlined"
        component="label"
        sx={styles.imageButton}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Change preview image'}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />
      </Button>
    </Box>
  );
};

export default ImageUpload;