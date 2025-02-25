import React from "react";
import { Container, Paper, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EventNotFound = ({ handleGoBack }) => {
  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          borderRadius: 4,
          background: "linear-gradient(to bottom right, #ffffff, #f7f9fc)",
        }}
      >
        <Typography
          variant="h4"
          color="error"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Event Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
          We couldn't find the event you're looking for. It may have been
          removed or is no longer available.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 3,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Back to Events
        </Button>
      </Paper>
    </Container>
  );
};

export default EventNotFound;