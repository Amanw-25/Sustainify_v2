import React from 'react';
import { FaCheck, FaCrown } from 'react-icons/fa';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';

export function PlanFeature({ children }) {
  return (
    <Box display="flex" alignItems="center" mb={1.5}>
      <FaCheck style={{ color: '#4CAF50', marginRight: '8px', flexShrink: 0 }} />
      <Typography variant="body1" color="text.secondary">
        {children}
      </Typography>
    </Box>
  );
}

export function PlanCard({ type, price, isPopular, isSelected, onSubscribe, loading }) {
  const features = [
    'Access all member-only stories',
    'Unlimited reading',
    'Support quality writing',
    'No ads experience',
    'Access on all devices',
    'Early access to new features',
    ...(type === 'yearly' ? ['Save 17% compared to monthly'] : [])
  ];

  return (
    <Paper
      elevation={isPopular ? 8 : 2}
      sx={{
        position: 'relative',
        p: 4,
        border: isSelected ? '2px solid #F8CC15' : '1px solid #e0e0e0',
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isSelected ? '#FFF8E1' : 'white',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      {isPopular && (
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#F8CC15',
            color: 'black',
            px: 3,
            py: 0.5,
            borderRadius: 'full',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <FaCrown />
          <Typography variant="subtitle2" fontWeight="medium">
            Most Popular
          </Typography>
        </Box>
      )}
      
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {type.charAt(0).toUpperCase() + type.slice(1)} Plan
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h3" component="span" fontWeight="bold">
          ₹{price}
        </Typography>

          <Typography variant="h6" color="text.secondary" ml={1}>
            /{type === 'monthly' ? 'mo' : 'year'}
          </Typography>
        </Box>
      </Box>

      <Box flex={1}>
        {features.map((feature, index) => (
          <PlanFeature key={index}>{feature}</PlanFeature>
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={onSubscribe}
        disabled={loading}
        sx={{
          mt: 3,
          py: 1.5,
          bgcolor: isSelected ? '#F8CC15' : '#e0e0e0',
          color: 'black',
          '&:hover': {
            bgcolor: '#e0b813'
          },
          borderRadius: 'full'
        }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          isSelected ? 'Selected' : `Choose &#8377{type}`
        )}
      </Button>
    </Paper>
  );
}
