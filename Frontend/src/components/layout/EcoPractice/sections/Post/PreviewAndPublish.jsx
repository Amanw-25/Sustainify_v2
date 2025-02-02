import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
} from '@mui/material';
import PhoneVerificationDialog from './PhoneVerificationDialog';
import ImageUpload from './ImageUpload';
import TopicSelector from './TopicSelector';

const PreviewAndPublish = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem(`draft-${postId}`);
    if (draft) {
      setPostData(JSON.parse(draft));
    }
  }, [postId]);

  const handlePublish = async () => {
    if (!isAuthenticated) {
      setShowPhoneDialog(true);
      return;
    }

    // API call to publish the post would go here
    console.log('Publishing:', postData);
    navigate(`/post/${postId}`);
  };

  if (!postData) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      py: 4
    }}>
      <Typography variant="h4" sx={{ 
        textAlign: 'center',
        mb: 4
      }}>
        Story Preview
      </Typography>

      <Grid container spacing={4} sx={{ 
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        {/* Left Side */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            height: '100%'
          }}>
            <ImageUpload 
              postData={postData} 
              setPostData={setPostData} 
            />
            <Typography variant="h5" sx={{ mt: 2 }}>
              {postData.title}
            </Typography>
          </Box>
        </Grid>

        {/* Right Side */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            height: '100%'
          }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {postData.kicker}
            </Typography>
            <TopicSelector 
              postData={postData} 
              setPostData={setPostData} 
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePublish}
              size="small"
              sx={{
                mt: 3,
                px: 4,
                py: 1
              }}
            >
              Publish now
            </Button>
          </Box>
        </Grid>
      </Grid>

      <PhoneVerificationDialog
        open={showPhoneDialog}
        onClose={() => setShowPhoneDialog(false)}
        onVerify={() => setIsAuthenticated(true)}
      />
    </Container>
  );
};

export default PreviewAndPublish;