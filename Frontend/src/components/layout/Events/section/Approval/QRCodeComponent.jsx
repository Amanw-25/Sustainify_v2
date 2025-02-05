import React from "react";
import QRCode from "react-qr-code";
import { Card, CardContent, Typography, Box } from "@mui/material";

const QRCodeComponent = ({ user, ticketNumber }) => {
  const qrData = JSON.stringify({ name: user.name, email: user.email, ticket: ticketNumber });

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", textAlign: "center", p: 2, mt: 3 }}>
      <CardContent>
        <Typography variant="h6">Your Event Ticket</Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <QRCode value={qrData} size={150} />
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Ticket Number: <strong>{ticketNumber}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QRCodeComponent;
