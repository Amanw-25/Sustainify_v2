import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Container, Typography, Avatar } from "@mui/material";
import Home_bg from "../assets/images/Home_bg.jpg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import userImg from "../assets/images/user.png";

const Home = () => {
  return (
    <section>
      <Box className="h-screen w-full">
        <Box
          className="absolute inset-0 z-0"
          sx={{
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
            className="w-full h-full object-cover opacity"
          />
        </Box>

        <Box className="absolute top-[35%] left-0 w-full text-center">
          <Typography
            variant="h1"
            className="text-white font-black text-4xl sm:text-2xl lg:text-4xl xl:text-5xl"
            fontWeight="bold"
          >
            Eco-Friendly Energy Solution <br /> for a Sustainable Future
          </Typography>
          <Typography
            variant="h4"
            className="text-white mt-8 hidden sm:block text-xs sm:text-base lg:text-[20px] xl:text-md"
          >
            Sustainify provides eco-friendly energy solutions.
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
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        <Box className="absolute bottom-16 left-60 hidden md:flex items-center gap-6 bg-white bg-opacity-50 p-4 rounded-lg shadow-lg w-80 sm:w-96 ml-[-10%]">
          <img
            src="https://cdn.pixabay.com/photo/2020/09/21/23/27/leaves-5591442_1280.jpg"
            alt="Home Background"
            className="w-24 h-24 object-cover rounded-lg"
          />

          <Box className="flex flex-col gap-2">
            <Typography variant="h5" fontWeight="bold" className="text-left">
              View Our Success Stories in Green Energy
            </Typography>
            <Typography variant="body2" className="text-left text-gray-800">
              Discover how we are making a difference with sustainable energy
              solutions.
            </Typography>
          </Box>
        </Box>


        <Box className="absolute bottom-16 right-20 hidden md:flex flex-col items-center justify-center gap-2 bg-white bg-opacity-50 p-4 rounded-lg shadow-lg w-48">

          <Box className="flex -space-x-2 gap-3">
            <Avatar alt="A" src={userImg} sx={{ width: 40, height: 40 }} />
            <Avatar alt="C" src={userImg} sx={{ width: 40, height: 40 }} />
          </Box>

          <Typography variant="h2" fontWeight="bold" className="text-center">
            10K+
          </Typography>

          <Typography variant="body1" className="text-center">
            customers
          </Typography>
        </Box>
      </Box>
    </section>
  );
};

export default Home;
