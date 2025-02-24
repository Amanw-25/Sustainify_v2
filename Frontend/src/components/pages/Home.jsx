import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Avatar, TextField, Grid, Container } from "@mui/material";
import Home_bg from "../../assets/images/Home_bg.jpg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import userImg from "../../assets/images/user.png";

import EmailIcon from "@mui/icons-material/Email";
import About from "../layout/About/About";
import Service from "../layout/Service/Service";
import Testimonial from "../layout/Testimonal/Testimonal";
// import About from "../components/layout/About/About";
// import Testimonial from "../components/layout/Testimonal/Testimonal";
// import Service from "../components/layout/Service/Service";

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

      <About />
      <Service />
      <Testimonial />

      {/* Email Subscribe Section */}
      <Container maxWidth="lg" sx={{ py: 16 }}>
        <Box
          sx={{
            backgroundColor: "#096AFF",
            borderRadius: "50px",
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
                borderRadius: "100px",
                width: { xs: "100%", sm: "300px" },
                '& input::placeholder': {
                  fontWeight: 'bold',
                  color: '#3e3636',
                  opacity: 1,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '100px',
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: "50px",
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
