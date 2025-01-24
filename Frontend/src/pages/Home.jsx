import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Avatar, TextField, Grid, Container } from "@mui/material";
import Home_bg from "../assets/images/Home_bg.jpg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import userImg from "../assets/images/user.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import About from "../components/About/About";

const Home = () => {
  return (
    <section>
      {/* Hero Section */}
      <Box className="relative h-screen w-full pt-0">
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 1,
            },
          }}
        >
          <img
            src={Home_bg}
            alt="Home Background"
            className="w-full h-full object-cover"
          />
        </Box>

        {/* Hero Content */}
        <Box className="absolute top-[30%] sm:top-[35%] left-0 w-full text-center px-4 sm:px-8">
          <Typography
            variant="h1"
            className="text-white font-black text-3xl sm:text-4xl lg:text-5xl"
            fontWeight="bold"
          >
            Eco-Friendly Energy Solutions <br /> for a Sustainable Future
          </Typography>
          <Typography
            variant="h5"
            className="text-white mt-4 text-sm sm:text-lg lg:text-xl"
          >
            Empowering a greener planet with clean energy innovations.
          </Typography>

          <Box className="flex mt-6 flex-col items-center">
            <Button
              variant="contained"
              component={Link}
              to="/services"
              className="rounded-full bg-white text-black shadow-lg"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: "50px",
                padding: "12px 24px",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
              }}
            >
              Explore Our Solutions
            </Button>
          </Box>
        </Box>

        {/* Success Stories Card */}
        <Box
          className="absolute bottom-28 hidden lg:flex left-4 sm:left-12 md:left-16 flex-col sm:flex-row items-center sm:items-start gap-4 bg-white bg-opacity-50 p-4 rounded-lg shadow-lg w-72 sm:w-96"
          sx={{
            marginBottom: { xs: "16px", sm: "20px", md: "50px" },
          }}
        >
          <img
            src="https://cdn.pixabay.com/photo/2020/09/21/23/27/leaves-5591442_1280.jpg"
            alt="Success Stories"
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
          />
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-gray-800 text-center sm:text-left"
            >
              Green Energy Success Stories
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-600 text-center sm:text-left mt-1"
            >
              Learn how our solar and wind energy projects are transforming
              communities and reducing emissions globally.
            </Typography>
          </Box>
        </Box>

        {/* Statistics Box */}
        <Box
          className="absolute bottom-12 hidden lg:flex right-4 sm:right-12 md:right-16 flex-col items-center gap-3 bg-white bg-opacity-50 p-4 rounded-lg shadow-lg w-48"
          sx={{
            marginBottom: { xs: "16px", sm: "20px", md: "100px" },
          }}
        >
          <Box className="flex -space-x-2">
            <Avatar alt="A" src={userImg} sx={{ width: 40, height: 40 }} />
            <Avatar alt="C" src={userImg} sx={{ width: 40, height: 40 }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            className="text-gray-800 text-center"
          >
            15K+
          </Typography>
          <Typography variant="body2" className="text-gray-600 text-center">
            Satisfied Customers Worldwide
          </Typography>
        </Box>
      </Box>

      <About/>

      {/* Services Section */}
      <Box sx={{ backgroundColor: "#f5f5f5", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" align="center" gutterBottom>
            Our Services
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            We offer a wide range of services to help you transition to
            eco-friendly energy solutions, from solar panel installations to
            energy audits and wind farm projects.
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "24px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48, color: "green" }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Solar Panel Installation
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Our experts provide professional solar panel installation
                  services, helping you switch to clean, renewable energy.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "24px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48, color: "green" }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Energy Audits
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  We offer energy audits to identify areas for improvement in
                  energy usage, ensuring your facility runs efficiently.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "24px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48, color: "green" }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  Wind Farm Projects
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Our wind farm solutions are designed to provide sustainable
                  and reliable power, significantly reducing reliance on fossil
                  fuels.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Email Subscribe Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            backgroundColor: "#1976d2",
            borderRadius: "8px",
            padding: "32px",
            textAlign: "center",
            color: "white",
          }}
        >
          <EmailIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Subscribe to Our Newsletter
          </Typography>
          <Typography variant="body1" paragraph>
            Stay updated with the latest news, energy solutions, and
            sustainability tips from Sustainify.
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Enter your email"
              sx={{
                backgroundColor: "white",
                borderRadius: "4px",
                width: { xs: "100%", sm: "300px" },
              }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: "4px",
                padding: "12px 24px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default Home;
