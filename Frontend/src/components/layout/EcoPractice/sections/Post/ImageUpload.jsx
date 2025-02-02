import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styles } from './styles.jsx';


const ImageUpload = ({ postData, setPostData }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData(prev => ({ ...prev, previewImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={styles.imageSection}>
      <Typography variant="h3" sx={{ fontWeight: "bold" , mb: 2}}>
        Story Preview
      </Typography>
      <img 
        src={postData.previewImage || 'https://sb.ecobnb.net/app/uploads/sites/3/2023/05/Green-Blogging-How-to-Start-a-Sustainable-Living-Blog-1-1170x490.jpg'} 
        alt="Preview" 
        style={styles.previewImg}
      />
      <Button
        variant="outlined"
        component="label"
        sx={styles.imageButton}
      >
        Change preview image
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