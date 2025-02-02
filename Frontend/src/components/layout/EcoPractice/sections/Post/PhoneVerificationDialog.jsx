import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { BASE_URL } from '../../../../../config.js';

const PhoneVerificationDialog = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${BASE_URL}/twilio/sendOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsOtpSent(true);
        setError('');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${BASE_URL}/twilio/verifyOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, code: otp }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('phoneVerified', 'true');
        onClose();
        navigate('/'); // Redirect to home page
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setOtp('');
    setIsOtpSent(false);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Verify Phone Number</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Alert severity="info" sx={{ mb: 2 }}>
          In order to publish, you need to authenticate your account with a phone number first.
        </Alert>
        
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            disabled={isOtpSent}
            sx={{ mb: 2 }}
          />
          
          {isOtpSent && (
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
            />
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        {!isOtpSent ? (
          <Button 
            onClick={handleSendOTP} 
            variant="contained"
            disabled={!phoneNumber || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
          </Button>
        ) : (
          <Button 
            onClick={handleVerifyOTP} 
            variant="contained"
            disabled={!otp || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PhoneVerificationDialog;