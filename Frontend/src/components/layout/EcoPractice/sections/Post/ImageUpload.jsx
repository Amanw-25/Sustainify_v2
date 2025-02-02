import React from 'react';
import { Box, Button } from '@mui/material';
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
      <img 
        src={postData.previewImage || 'https://technovans.com/wp-content/uploads/2019/05/top-12-blogging-tips-for-beginners.jpg'} 
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