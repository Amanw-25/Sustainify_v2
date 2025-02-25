import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  Zoom,
  Chip,
  Fade,
  Slide
} from "@mui/material";

// Import Material UI Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import WindPowerIcon from "@mui/icons-material/WindPower";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import WaterIcon from "@mui/icons-material/Water";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeIcon from "@mui/icons-material/Home";
import FactoryIcon from "@mui/icons-material/Factory";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Example placeholder images
const HERO_BG = "https://images.unsplash.com/photo-1473773508845-188df298d2d1";
const ABOUT_IMG = "https://images.unsplash.com/photo-1497440001374-f26997328c1b";
const TESTIMONIAL_AVATARS = [
  "https://randomuser.me/api/portraits/women/32.jpg",
  "https://randomuser.me/api/portraits/men/22.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg"
];

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    stats: false,
    about: false,
    services: false,
    projects: false,
    testimonials: false,
    cta: false
  });

  // Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['hero', 'stats', 'about', 'services', 'projects', 'testimonials', 'cta'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Statistics data
  const stats = [
    { count: "2,500+", label: "Projects Completed", icon: <ElectricBoltIcon /> },
    { count: "30,000+", label: "Trees Planted", icon: <EnergySavingsLeafIcon /> },
    { count: "45%", label: "Carbon Reduction", icon: <SolarPowerIcon /> },
    { count: "18+", label: "Countries Served", icon: <WindPowerIcon /> }
  ];

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section - Dynamic and Bold */}
      <Box
        id="hero"
        sx={{
          position: "relative",
          height: { xs: "100vh", md: "90vh" },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "#111"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to bottom right, rgba(0,100,0,0.8), rgba(0,0,80,0.6))",
              zIndex: 1
            }
          }}
        >
          <Box
            component="img"
            src={HERO_BG}
            alt="Sustainable Energy"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7)"
            }}
          />
        </Box>

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Fade in={visibleSections.hero} timeout={1000}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    letterSpacing: "4px",
                    color: "#5cff9d",
                    mb: 2,
                    display: "block"
                  }}
                >
                  RENEWABLE ENERGY SOLUTIONS
                </Typography>

                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.2rem" },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    color: "white",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                  }}
                >
                  Power Your World <br />
                  <Box component="span" sx={{ color: "#5cff9d" }}>
                    Sustainably
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.85)",
                    maxWidth: "600px",
                    mb: 4,
                    lineHeight: 1.6
                  }}
                >
                  We're revolutionizing how the world accesses clean energy with cutting-edge
                  sustainable solutions that protect our planet while powering our future.
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/solutions"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: "#5cff9d",
                      color: "#111",
                      borderRadius: "30px",
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "#4ddb85",
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    Explore Solutions
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<PlayCircleOutlineIcon />}
                    sx={{
                      color: "white",
                      borderColor: "white",
                      borderRadius: "30px",
                      py: 1.5,
                      px: 3,
                      fontSize: "1rem",
                      "&:hover": {
                        borderColor: "#5cff9d",
                        color: "#5cff9d",
                        bgcolor: "rgba(92, 255, 157, 0.1)"
                      }
                    }}
                  >
                    Watch Our Story
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Fade>
        </Container>

        {/* Wave shape divider */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
            zIndex: 2
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{
              position: "relative",
              display: "block",
              width: "calc(100% + 1.3px)",
              height: "60px",
              transform: "rotateY(180deg)"
            }}
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="#ffffff"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="#ffffff"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="#ffffff"
            />
          </svg>
        </Box>
      </Box>

      {/* Stats Section - Animated & Clean */}
      <Box
        id="stats"
        sx={{
          py: { xs: 8, md: 10 },
          backgroundColor: "#fff"
        }}
      >
        <Container maxWidth="lg">
          <Slide direction="up" in={visibleSections.stats} timeout={800}>
            <Grid container spacing={3} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      textAlign: "center",
                      height: "100%",
                      p: 2,
                      borderRadius: 3,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          color: "#008854",
                          fontSize: { xs: 36, md: 48 },
                          mb: 1,
                          display: "flex",
                          justifyContent: "center"
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: { xs: "1.8rem", md: "2.5rem" },
                          fontWeight: 700,
                          mb: 1,
                          color: "#1a1a1a"
                        }}
                      >
                        {stat.count}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          color: "#666"
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Slide>
        </Container>
      </Box>

      {/* About Section - Modern Split Layout */}
      <Box
        id="about"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: "#f8f9fa"
        }}
      >
        <Container maxWidth="lg">
          <Fade in={visibleSections.about} timeout={1000}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    height: { xs: "300px", md: "450px" },
                    position: "relative",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                >
                  <Box
                    component="img"
                    src={ABOUT_IMG}
                    alt="About Sustainify"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      background: "linear-gradient(transparent, rgba(0,50,30,0.8))",
                      p: 3,
                      color: "white"
                    }}
                  >
                    <Typography
                      variant="overline"
                      sx={{ color: "#5cff9d", fontWeight: 600 }}
                    >
                      OUR MISSION
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      15+ Years of Innovation
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#008854",
                    fontSize: "1rem",
                    letterSpacing: "2px",
                    mb: 2,
                    display: "block"
                  }}
                >
                  ABOUT SUSTAINIFY
                </Typography>

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2rem", md: "2.7rem" },
                    fontWeight: 700,
                    mb: 3,
                    color: "#1a1a1a"
                  }}
                >
                  Leading the Clean <br />
                  Energy Revolution
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.1rem",
                    color: "#555",
                    mb: 4,
                    lineHeight: 1.7
                  }}
                >
                  Founded in 2010, Sustainify has grown from a small renewable energy startup to a global
                  leader in sustainable solutions. We've pioneered innovations in solar, wind, and hydroelectric
                  technologies that are now deployed across six continents.
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <AutoAwesomeIcon sx={{ color: "#008854", fontSize: 28, mt: 0.5 }} />
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          Innovative Technology
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          State-of-the-art sustainable energy solutions
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <EnergySavingsLeafIcon sx={{ color: "#008854", fontSize: 28, mt: 0.5 }} />
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          Carbon Negative
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Our operations remove more carbon than they produce
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  variant="outlined"
                  component={Link}
                  to="/about"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: "#008854",
                    color: "#008854",
                    borderRadius: "30px",
                    py: 1.2,
                    px: 3,
                    "&:hover": {
                      borderColor: "#008854",
                      bgcolor: "rgba(0,136,84,0.1)"
                    }
                  }}
                >
                  Learn Our Story
                </Button>
              </Grid>
            </Grid>
          </Fade>
        </Container>
      </Box>

      {/* Services Section - Card Grid with Icons */}
      <Box
        id="services"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: "#fff"
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="overline"
              sx={{
                color: "#008854",
                fontSize: "1rem",
                letterSpacing: "2px",
                mb: 2,
                display: "block"
              }}
            >
              OUR SERVICES
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.7rem" },
                fontWeight: 700,
                mb: 2,
                color: "#1a1a1a"
              }}
            >
              Sustainable Energy Solutions
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                color: "#555",
                maxWidth: "700px",
                mx: "auto"
              }}
            >
              We offer comprehensive clean energy services tailored to residential,
              commercial, and industrial clients worldwide.
            </Typography>
          </Box>

          <Fade in={visibleSections.services} timeout={1000}>
            <Grid container spacing={4}>
              {[
                {
                  icon: <SolarPowerIcon sx={{ fontSize: 40 }} />,
                  title: "Solar Energy",
                  description: "High-efficiency photovoltaic systems customized for your energy needs and space constraints."
                },
                {
                  icon: <WindPowerIcon sx={{ fontSize: 40 }} />,
                  title: "Wind Power",
                  description: "From small turbines to large wind farms, we design solutions that maximize energy generation."
                },
                {
                  icon: <WaterIcon sx={{ fontSize: 40 }} />,
                  title: "Hydroelectric",
                  description: "Clean, reliable electricity from water sources with minimal environmental impact."
                },
                {
                  icon: <EnergySavingsLeafIcon sx={{ fontSize: 40 }} />,
                  title: "Energy Efficiency",
                  description: "Comprehensive audits and optimizations to reduce consumption and lower costs."
                },
                {
                  icon: <ElectricBoltIcon sx={{ fontSize: 40 }} />,
                  title: "Smart Grid Solutions",
                  description: "Intelligent energy management systems for better distribution and usage."
                },
                {
                  icon: <ApartmentIcon sx={{ fontSize: 40 }} />,
                  title: "Commercial Retrofits",
                  description: "Transform existing buildings into energy-efficient, sustainable structures."
                }
              ].map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          bgcolor: "rgba(0,136,84,0.1)",
                          color: "#008854",
                          width: 80,
                          height: 80,
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3
                        }}
                      >
                        {service.icon}
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: "#1a1a1a"
                        }}
                      >
                        {service.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "#555",
                          mb: 3
                        }}
                      >
                        {service.description}
                      </Typography>

                      <Button
                        component={Link}
                        to={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          color: "#008854",
                          p: 0,
                          "&:hover": {
                            bgcolor: "transparent",
                            color: "#00663e",
                            "& .MuiSvgIcon-root": {
                              transform: "translateX(4px)"
                            }
                          },
                          "& .MuiSvgIcon-root": {
                            transition: "transform 0.3s ease"
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Fade>
        </Container>
      </Box>

      {/* Recent Projects - Carousel Alternative */}
      <Box
        id="projects"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: "#f0f7f4"
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="overline"
              sx={{
                color: "#008854",
                fontSize: "1rem",
                letterSpacing: "2px",
                mb: 2,
                display: "block"
              }}
            >
              RECENT PROJECTS
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.7rem" },
                fontWeight: 700,
                mb: 2,
                color: "#1a1a1a"
              }}
            >
              Transforming Energy Landscapes
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                color: "#555",
                maxWidth: "700px",
                mx: "auto"
              }}
            >
              Explore our recent initiatives that are making a significant impact
              in communities around the world.
            </Typography>
          </Box>

          <Fade in={visibleSections.projects} timeout={1000}>
            <Grid container spacing={4}>
              {[
                {
                  image: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
                  category: "SOLAR",
                  title: "Desert Sun Array",
                  location: "Nevada, USA",
                  icon: <HomeIcon />
                },
                {
                  image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7",
                  category: "WIND",
                  title: "Coastal Wind Farm",
                  location: "Denmark",
                  icon: <FactoryIcon />
                },
                {
                  image: "https://images.unsplash.com/photo-1567177662154-dfeb4c93b6ae",
                  category: "HYDRO",
                  title: "Alpine Flow System",
                  location: "Switzerland",
                  icon: <ApartmentIcon />
                }
              ].map((project, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px)"
                      },
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 220,
                        overflow: "hidden"
                      }}
                    >
                      <Box
                        component="img"
                        src={project.image}
                        alt={project.title}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                          "&:hover": {
                            transform: "scale(1.05)"
                          }
                        }}
                      />
                      <Chip
                        label={project.category}
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          bgcolor: "#008854",
                          color: "white",
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: "#1a1a1a"
                        }}
                      >
                        {project.title}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                          color: "#666"
                        }}
                      >
                        {project.icon}
                        <Typography variant="body2">
                          {project.location}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#555",
                          mb: 3
                        }}
                      >
                        A cutting-edge {project.category.toLowerCase()} energy project delivering clean,
                        sustainable power to local communities while reducing carbon emissions.
                      </Typography>

                      <Button
                        component={Link}
                        to={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          borderColor: "#008854",
                          color: "#008854",
                          borderRadius: "30px",
                          "&:hover": {
                            borderColor: "#008854",
                            bgcolor: "rgba(0,136,84,0.1)"
                          }
                        }}
                      >
                        View Project
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Fade>
        </Container>
      </Box>

      {/* Testimonials Section - Rotating Cards */}
      <Box
        id="testimonials"
        sx={{
          py: { xs: 10, md: 14 },
          backgroundColor: "primary.main", // Using theme color instead of hardcoded value
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Container maxWidth="lg">
          {/* Heading Section with Animation */}
          <Zoom in={visibleSections.testimonials} timeout={800}>
            <Box sx={{ textAlign: "center", mb: { xs: 7, md: 9 } }}>


              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3rem" },
                  fontWeight: 800,
                  mb: 2,
                  background: "linear-gradient(90deg, #ffffff 0%, #9fffd1 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                }}
              >
                Real Results, Real Impact
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  maxWidth: "700px",
                  mx: "auto",
                  opacity: 0.9,
                  lineHeight: 1.7
                }}
              >
                Discover how our sustainable energy solutions have transformed businesses,
                communities, and organizations nationwide with measurable results.
              </Typography>
            </Box>
          </Zoom>

          {/* Testimonials Carousel with Enhanced Navigation */}
          <Box sx={{ position: "relative", mt: 4 }}>
            {/* Previous Button */}
            <IconButton
              onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : 2))}
              sx={{
                position: "absolute",
                left: { xs: "5%", md: "-30px" },
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                "&:hover": {
                },
                zIndex: 2,
                display: { xs: "none", md: "flex" }
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            {/* Testimonials */}
            <Fade in={visibleSections.testimonials} timeout={1000}>
              <Box sx={{ overflow: "hidden" }}>
                <Box
                  sx={{
                    display: "flex",
                    transition: "transform 0.5s ease",
                    transform: `translateX(-${activeSlide * 100}%)`,
                  }}
                >
                  {[
                    {
                      quote: "Sustainify's expertise helped us reduce our factory's energy consumption by 42% while improving production efficiency. Their holistic approach to sustainability has become a cornerstone of our business strategy.",
                      name: "Sarah Johnson",
                      title: "Operations Director, GreenManufacturing Inc.",
                      avatar: TESTIMONIAL_AVATARS[0],
                      metrics: [
                        { label: "Energy Reduction", value: "42%" },
                        { label: "ROI Timeline", value: "16 months" }
                      ]
                    },
                    {
                      quote: "Our community wind project with Sustainify has exceeded all expectations. Not only are we energy independent, but the revenue generated funds our public schools and has created 27 permanent local jobs.",
                      name: "Michael Chen",
                      title: "Mayor, Windcrest Township",
                      avatar: TESTIMONIAL_AVATARS[1],
                      metrics: [
                        { label: "Energy Production", value: "124%" },
                        { label: "Jobs Created", value: "27" }
                      ]
                    },
                    {
                      quote: "The comprehensive energy retrofits Sustainify implemented across our corporate campuses delivered more than just cost savings—they've improved employee satisfaction and bolstered our reputation as an industry sustainability leader.",
                      name: "Elena Rodriguez",
                      title: "Sustainability Officer, Global Properties",
                      avatar: TESTIMONIAL_AVATARS[2],
                      metrics: [
                        { label: "Energy Savings", value: "38%" },
                        { label: "Annual Cost Reduction", value: "$1.8M" }
                      ]
                    }
                  ].map((testimonial, index) => (
                    <Box
                      key={index}
                      sx={{
                        minWidth: "100%",
                        px: { xs: 2, md: 6 }
                      }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.08)",
                          borderRadius: "20px",
                          p: { xs: 3, md: 6 },
                          backdropFilter: "blur(10px)",
                          boxShadow: "0 20px 80px rgba(0,0,0,0.3)",
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          alignItems: "center",
                          gap: { xs: 4, md: 6 }
                        }}
                      >
                        {/* Profile Column */}
                        <Box sx={{
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: { md: "220px" }
                        }}>
                          <Avatar
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            sx={{
                              width: 120,
                              height: 120,
                              mb: 3,
                              border: "4px solid rgba(159, 255, 209, 0.6)",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                            }}
                          />

                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              mb: 1
                            }}
                          >
                            {testimonial.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              opacity: 0.9,
                              fontSize: "0.95rem",
                              mb: 3
                            }}
                          >
                            {testimonial.title}
                          </Typography>

                          {/* Metrics */}
                          <Box sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "center",
                            flexWrap: "wrap"
                          }}>
                            {testimonial.metrics.map((metric, idx) => (
                              <Box key={idx} sx={{
                                textAlign: "center",
                                backgroundColor: "rgba(159, 255, 209, 0.1)",
                                borderRadius: "12px",
                                p: 1.5,
                                minWidth: "90px"
                              }}>
                                <Typography variant="h6" sx={{ color: "#9fffd1", fontWeight: 800 }}>
                                  {metric.value}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: "0.8rem" }}>
                                  {metric.label}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>

                        {/* Quote Column */}
                        <Box sx={{ flex: 1 }}>
                          <FormatQuoteIcon
                            sx={{
                              fontSize: 70,
                              color: "#9fffd1",
                              opacity: 0.5,
                              mb: 2
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 400,
                              lineHeight: 1.8,
                              fontStyle: "italic",
                              letterSpacing: "0.3px",
                              fontSize: { xs: "1.1rem", md: "1.25rem" }
                            }}
                          >
                            "{testimonial.quote}"
                          </Typography>
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Fade>

            {/* Next Button */}
            <IconButton
              onClick={() => setActiveSlide((prev) => (prev < 2 ? prev + 1 : 0))}
              sx={{
                position: "absolute",
                right: { xs: "5%", md: "-30px" },
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(159, 255, 209, 0.3)",
                },
                zIndex: 2,
                display: { xs: "none", md: "flex" }
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Dots Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 5
            }}
          >
            {[0, 1, 2].map((index) => (
              <Button
                key={index}
                onClick={() => setActiveSlide(index)}
                variant={index === activeSlide ? "contained" : "outlined"}
                sx={{
                  minWidth: "unset",
                  width: index === activeSlide ? "32px" : "12px",
                  height: "12px",
                  borderRadius: "20px",
                  p: 0,
                  backgroundColor: index === activeSlide ? "#9fffd1" : "transparent",
                  borderColor: "rgba(159, 255, 209, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: index === activeSlide ? "#9fffd1" : "rgba(159, 255, 209, 0.2)",
                  }
                }}
              />
            ))}
          </Box>
        </Container>

        <Box
          sx={{
            position: "absolute",
            top: "5%",
            left: "5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(159,255,209,0.2) 0%, rgba(0,136,84,0) 70%)",
            filter: "blur(30px)",
            zIndex: 0
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(159,255,209,0.15) 0%, rgba(0,136,84,0) 70%)",
            filter: "blur(40px)",
            zIndex: 0
          }}
        />

        <Box
          component="svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "15%",
            zIndex: 0,
            opacity: 0.5
          }}
        >
          <path
            fill="rgba(159, 255, 209, 0.05)"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,234.7C672,235,768,213,864,202.7C960,192,1056,192,1152,197.3C1248,203,1344,213,1392,218.7L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </Box>
      </Box>

      {/* Call to Action - Newsletter */}
      <Box
        id="cta"
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: "#fff"
        }}
      >
        <Container maxWidth="md">
          <Slide direction="up" in={visibleSections.cta} timeout={800}>
            <Card
              sx={{
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
                position: "relative"
              }}
            >
              <Box
                sx={{
                  background: "linear-gradient(45deg, #008854, #00bf74)",
                  p: { xs: 4, md: 6 },
                  textAlign: "center",
                  color: "white",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Decorative circles */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "-10%",
                    left: "-5%",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    zIndex: 0
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    bottom: "-15%",
                    right: "-10%",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    zIndex: 0
                  }}
                />

                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    Ready to Embrace Sustainable Energy?
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "1.1rem",
                      mb: 4,
                      maxWidth: "700px",
                      mx: "auto",
                      opacity: 0.9
                    }}
                  >
                    Join our newsletter to receive the latest updates on renewable technologies,
                    sustainability tips, and exclusive offers.
                  </Typography>

                  <Box
                    component="form"
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      maxWidth: "600px",
                      mx: "auto"
                    }}
                  >
                    <TextField
                      placeholder="Enter your email"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <MailOutlineIcon
                            sx={{
                              mr: 1,
                              color: "rgba(0,0,0,0.5)"
                            }}
                          />
                        ),
                        sx: {
                          bgcolor: "white",
                          borderRadius: "40px",
                          "& fieldset": {
                            borderColor: "transparent"
                          },
                          "&:hover fieldset": {
                            borderColor: "transparent"
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "transparent"
                          }
                        }
                      }}
                    />

                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#00331f",
                        color: "white",
                        borderRadius: "40px",
                        py: { xs: 1.5, md: 2 },
                        px: { xs: 3, md: 4 },
                        fontSize: "1rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        "&:hover": {
                          bgcolor: "#002215"
                        }
                      }}
                    >
                      Subscribe Now
                    </Button>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      opacity: 0.7
                    }}
                  >
                    By subscribing, you agree to our Privacy Policy and Terms of Service.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Slide>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;