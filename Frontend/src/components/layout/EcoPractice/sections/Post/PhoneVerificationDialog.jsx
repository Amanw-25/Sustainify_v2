import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert
} from '@mui/material';

const PhoneVerificationDialog = ({ open, onClose, onVerify }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    // Phone verification logic would go here
    onVerify();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify Phone Number</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          In order to publish, you need to authenticate your account with a phone number first.
        </Alert>
        <TextField
          fullWidth
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1 (555) 555-5555"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhoneVerificationDialog;