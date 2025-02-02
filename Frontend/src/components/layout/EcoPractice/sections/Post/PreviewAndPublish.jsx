import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import PhoneVerificationDialog from './PhoneVerificationDialog';
import ImageUpload from './ImageUpload';
import TopicSelector from './TopicSelector';

const PreviewAndPublish = () => {
  const { postId } = useParams(); // Access postId from URL
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem(`draft-${postId}`); // Use postId to retrieve the draft
    if (draft) {
      setPostData(JSON.parse(draft)); // Parse and set the postData
    }
  }, [postId]);  // This effect runs when postId changes

  const handlePublish = async () => {
    setShowPhoneDialog(true);  // Show phone verification dialog when publishing
  };

  const handleConfirmPublish = async () => {
    console.log('Publishing:', postData); // Handle the publish logic here
    navigate(`/post/${postId}`);  // Navigate to the actual post page after publishing
  };

  if (!postData) return <div>Loading...</div>;  // Show loading state if postData isn't available

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
      <Typography variant="h2" sx={{ textAlign: 'center', mb: 4, font: 'bold' }}>
        Confirmation Page
      </Typography>
      <Grid container spacing={4} sx={{ justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* Left Side */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <ImageUpload postData={postData} setPostData={setPostData} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              {postData.title}
            </Typography>
          </Box>
        </Grid>
        {/* Right Side */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {postData.kicker}
            </Typography>
            <TopicSelector postData={postData} setPostData={setPostData} />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePublish}
              size="small"
              sx={{ mt: 3, px: 4, py: 1, borderRadius: 3 }}
            >
              Publish now
            </Button>
          </Box>
        </Grid>
      </Grid>

      <PhoneVerificationDialog
        open={showPhoneDialog}
        onClose={() => setShowPhoneDialog(false)}
        onVerify={handleConfirmPublish} // Call to publish after OTP verification
      />
    </Container>
  );
};

export default PreviewAndPublish;
