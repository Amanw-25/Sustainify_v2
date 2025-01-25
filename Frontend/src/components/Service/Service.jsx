import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { keyframes } from '@emotion/react';

// Define a subtle animation for the service cards
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Service = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight="bold"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 4,
          }}
        >
          Our Services
        </Typography>
        <Typography
          variant="body1"
          align="center"
          paragraph
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            maxWidth: '800px',
            mx: 'auto',
            mb: 6,
          }}
        >
          We offer a wide range of services to help you transition to eco-friendly energy solutions, from solar panel installations to energy audits and wind farm projects.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {[
            {
              title: 'Solar Panel Installation',
              description:
                'Our experts provide professional solar panel installation services, helping you switch to clean, renewable energy.',
            },
            {
              title: 'Energy Audits',
              description:
                'We offer energy audits to identify areas for improvement in energy usage, ensuring your facility runs efficiently.',
            },
            {
              title: 'Wind Farm Projects',
              description:
                'Our wind farm solutions are designed to provide sustainable power, significantly reducing reliance on fossil fuels.',
            },
          ].map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  },
                  animation: `${fadeIn} 0.6s ease ${index * 0.2}s`,
                  animationFillMode: 'both',
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: '64px',
                    color: '#4caf50',
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mt: 2,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    color: '#555',
                    lineHeight: '1.6',
                  }}
                >
                  {service.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Service;