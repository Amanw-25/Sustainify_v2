import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import About_img from "../../assets/images/about_img.jpg";

const About = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6} sx={{ marginTop: { xs: 6, md: 15 } }}>
            <Box
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                marginRight: { xs: 0, md: 10 }, // Add this line to add margin on the right side
                "& img": {
                  width: "100%",
                  height: "500px",
                  display: "block",
                },
              }}
            >
              <img src={About_img} className="h-full w-full" alt="About Us" />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "2.5rem" },
                lineHeight: 1.2,
                marginTop: { xs: 6, md: 15 },
              }}
            >
              About Sustainify
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.1rem" },
              }}
            >
              At Sustainify, we provide cutting-edge eco-friendly energy
              solutions that are designed to reduce carbon footprints and
              promote a greener, more sustainable world. Our mission is to help
              industries, businesses, and households transition to renewable
              energy sources like solar and wind power, making the world a
              better place for future generations.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.1rem" },
              }}
            >
              We are pioneers in sustainable energy and have successfully
              implemented over 500 solar projects globally. Our expert team is
              committed to offering innovative, reliable, and affordable energy
              solutions tailored to meet the unique needs of our clients.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h1"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  }}
                >
                  95%
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "1rem", md: "0.8rem" },
                  }}
                >
                  Successful Green <br /> Solution
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: "center",
                  minWidth: "120px",
                }}
              >
                <Typography
                  variant="h1"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  }}
                >
                  95%
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "1rem", md: "0.8rem" },
                  }}
                >
                  Successful Green <br /> Solution
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
