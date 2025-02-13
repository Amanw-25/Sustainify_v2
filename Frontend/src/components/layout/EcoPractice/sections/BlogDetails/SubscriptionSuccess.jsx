import React, { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../../../../config";
import {
  CircularProgress,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const SubscriptionSuccess = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifySubscription = async () => {
      if (!sessionId) {
        setError("Invalid session ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/subscription/verify?session_id=${sessionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setPlan(data.subscription.planType);
          setUserAddress(data.subscription.billingDetails?.address);
        } else {
          setError(data.message || "Subscription verification failed.");
        }
      } catch (err) {
        console.error("Error verifying subscription:", err);
        setError("An error occurred while verifying subscription.");
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [sessionId]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
      p={2}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <AiFillCheckCircle
              size={60}
              color="green"
              style={{ marginBottom: 16 }}
            />
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1} mb={3}>
              Thank you for subscribing to our <strong>{plan}</strong> plan.
              Your membership is now active.
            </Typography>

            {userAddress && (
              <Box
                bgcolor="#f1f1f1"
                p={2}
                borderRadius={2}
                textAlign="left"
                mb={3}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Billing Address:
                </Typography>
                <Typography variant="body2">
                  {userAddress.line1}, {userAddress.city},{" "}
                  {userAddress.postal_code}, {userAddress.country}
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={() => (window.location.href = "/")}
              sx={{
                bgcolor: "#F8CC15",
                color: "black",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#e3b913" },
              }}
            >
              Back to Home
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default SubscriptionSuccess;
