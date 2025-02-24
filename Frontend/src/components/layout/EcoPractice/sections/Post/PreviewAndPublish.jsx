import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import ImageUpload from "./ImageUpload";
import TopicSelector from "./TopicSelector";
import PhoneVerificationDialog from "./PhoneVerificationDialog";
import { BASE_URL } from "../../../../../config.js";

const PreviewAndPublish = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    kicker: "",
    content: "",
    isMemberOnly: false,
    tags: [],
    previewImage: null,
  });
  const [openPhoneVerification, setOpenPhoneVerification] = useState(false);
  const token = localStorage.getItem("token");
  const DEFAULT_IMAGE = "https://sb.ecobnb.net/app/uploads/sites/3/2023/05/Green-Blogging-How-to-Start-a-Sustainable-Living-Blog-1-1170x490.jpg";

  useEffect(() => {
    const draftId = localStorage.getItem("draft-id");
    if (draftId) {
      const draft = localStorage.getItem(draftId);
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setPostData({
          ...parsedDraft,
          previewImage: parsedDraft.previewImage || null
        });
      }
    }
  }, []);

  const publishPost = async () => {
    if (
      !postData ||
      !postData.title ||
      !postData.kicker ||
      !postData.content ||
      !postData.tags
    ) {
      console.error(
        "Missing required fields. Please ensure all required fields are filled."
      );
      return;
    }

    if (!token) {
      console.error("No authentication token found. User must be logged in.");
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken?.userId || decodedToken?.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return;
    }

    if (!userId) {
      console.error("User ID not found in token.");
      return;
    }

    const readTime = Math.ceil(postData.content.split(" ").length / 200);

    const finalImageUrl = postData.previewImage || DEFAULT_IMAGE;

    const sanitizedPostData = {
      title: postData.title,
      kicker: postData.kicker,
      content: postData.content,
      author: userId,
      previewImage: finalImageUrl,
      isMemberOnly: postData.isMemberOnly || false,
      tags: postData.tags || [],
      readTime: readTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const response = await fetch(`${BASE_URL}/blog/createBlogPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sanitizedPostData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to publish: ${errorData.message || response.statusText}`
        );
      }

      const draftId = localStorage.getItem("draft-id");
      if (draftId) {
        localStorage.removeItem(draftId);
        localStorage.removeItem("draft-id");
      }
      
      navigate(`/blog`);
    } catch (error) {
      console.error("Publishing error:", error.message);
    }
  };

  const handlePublish = () => {
    setOpenPhoneVerification(true);
  };

  if (!postData) return <div>Loading...</div>;

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Typography
        variant="h2"
        sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
      >
        Confirmation Page
      </Typography>
      <Grid
        container
        spacing={4}
        sx={{ justifyContent: "center", alignItems: "flex-start" }}
      >
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <ImageUpload postData={postData} setPostData={setPostData} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              {postData.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              height: "100%",
            }}
          >
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
        open={openPhoneVerification}
        onClose={() => setOpenPhoneVerification(false)}
        onVerificationSuccess={() => {
          setOpenPhoneVerification(false);
          publishPost();
        }}
      />
    </Container>
  );
};

export default PreviewAndPublish;