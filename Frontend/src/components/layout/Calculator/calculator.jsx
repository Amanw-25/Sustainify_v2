import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Modal,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
} from "@mui/icons-material";
import { primaryFields } from "./sections/content";
import { secondaryFields } from "./sections/content";

const Calculator = () => {
  const [activeTab, setActiveTab] = useState("primary");
  const [formData, setFormData] = useState({
    petrol: 0,
    diesel: 0,
    electricity: 0,
    naturalGas: 0,
    cng: 0,
    flight: 0,
    lpg: 0,
    fuelOil: 0,
    coal: 0,
    organicWaste: 0,
    paperWaste: 0,
    plasticWaste: 0,
    waterUsage: 0,
    busUsage: 0,
    trainUsage: 0,
    metroUsage: 0,
  });
  const [totalFootprint, setTotalFootprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [tipsData, setTipsData] = useState(null);
  const [tipsError, setTipsError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateFootprint = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const requestBody = {
        Petrol: formData.petrol,
        Diesel: formData.diesel,
        Electricity: formData.electricity,
        NaturalGas: formData.naturalGas,
        CNG: formData.cng,
        Flight: formData.flight,
        LPG: formData.lpg,
        FuelOil: formData.fuelOil,
        Coal: formData.coal,
        OrganicWaste: formData.organicWaste,
        PaperWaste: formData.paperWaste,
        PlasticWaste: formData.plasticWaste,
        WaterUsage: formData.waterUsage,
        PublicTransportUsage: {
          Bus: formData.busUsage,
          Train: formData.trainUsage,
          Metro: formData.metroUsage,
        },
      };

      const response = await fetch(
        "http://localhost:5130/api/v1/sustainify/carbon/calculate-carbon-footprint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTotalFootprint(data.carbonFootprint);
        setLoginError("");
        setActiveTab("total");
      } else {
        setLoginError(
          data.message || "An error occurred while calculating the footprint."
        );
      }
    } catch (error) {
      setLoginError("An error occurred while calculating the footprint.");
    } finally {
      setLoading(false);
    }
  };

  const getTips = async () => {
    try {
      const requestBody = {
        // Similar to calculateFootprint request body
      };

      const response = await fetch(
        "http://localhost:5130/api/v1/sustainify/mistral/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTipsData(data);
        setTipsModalOpen(true);
        setTipsError("");
      } else {
        setTipsError("Failed to fetch tips.");
      }
    } catch (error) {
      setTipsError("Error fetching tips.");
    }
  };

  // const primaryFields = [
  //   {
  //     key: "petrol",
  //     label: "Petrol",
  //     unit: "L/month",
  //     icon: <LocalGasStation />,
  //   },
  //   {
  //     key: "diesel",
  //     label: "Diesel",
  //     unit: "L/month",
  //     icon: <LocalGasStation />,
  //   },
  //   {
  //     key: "electricity",
  //     label: "Electricity",
  //     unit: "kWh/month",
  //     icon: <ElectricBolt />,
  //   },
  //   {
  //     key: "naturalGas",
  //     label: "Natural Gas",
  //     unit: "m³/month",
  //     icon: <GasMeter />,
  //   },
  //   { key: "cng", label: "CNG", unit: "kg/month", icon: <GasMeter /> },
  //   { key: "flight", label: "Flight", unit: "km/month", icon: <Flight /> },
  //   {
  //     key: "lpg",
  //     label: "LPG",
  //     unit: "kg/month",
  //     icon: <LocalFireDepartment />,
  //   },
  //   {
  //     key: "fuelOil",
  //     label: "Fuel Oil",
  //     unit: "L/month",
  //     icon: <LocalGasStation />,
  //   },
  //   {
  //     key: "coal",
  //     label: "Coal",
  //     unit: "kg/month",
  //     icon: <LocalFireDepartment />,
  //   },
  // ];

  // const secondaryFields = [
  //   {
  //     key: "organicWaste",
  //     label: "Organic Waste",
  //     unit: "kg/month",
  //     icon: <Delete />,
  //   },
  //   {
  //     key: "paperWaste",
  //     label: "Paper Waste",
  //     unit: "kg/month",
  //     icon: <Delete />,
  //   },
  //   {
  //     key: "plasticWaste",
  //     label: "Plastic Waste",
  //     unit: "kg/month",
  //     icon: <Delete />,
  //   },
  //   {
  //     key: "waterUsage",
  //     label: "Water Usage",
  //     unit: "m³/month",
  //     icon: <WaterDrop />,
  //   },
  //   {
  //     key: "busUsage",
  //     label: "Bus Usage",
  //     unit: "km/month",
  //     icon: <DirectionsBus />,
  //   },
  //   {
  //     key: "trainUsage",
  //     label: "Train Usage",
  //     unit: "km/month",
  //     icon: <Train />,
  //   },
  //   {
  //     key: "metroUsage",
  //     label: "Metro Usage",
  //     unit: "km/month",
  //     icon: <DirectionsSubway />,
  //   },
  // ];

  const renderFields = (fields) => (
    <Grid container spacing={2}>
      {fields.map((field) => (
        <Grid item xs={12} sm={6} key={field.key}>
          <TextField
            fullWidth
            type="number"
            label={field.label}
            variant="outlined"
            value={formData[field.key]}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={`Enter ${field.unit}`}
            InputProps={{
              startAdornment: field.icon,
              inputProps: { min: 0 },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#222222", // Black border for light mode
                },
                "&:hover fieldset": {
                  borderColor: "black", // Black border on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black", // Black border when focused
                },
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
      }}
    >
      {/* Heading and Description */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          py: 6, // Add padding for better spacing
          borderRadius: 2, // Rounded corners
        }}
      >
        <Typography
          variant="h2" // Larger heading
          sx={{
            color: "#004d40",
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "3rem" }, // Responsive font size
            mb: 2, // Margin bottom for spacing
          }}
        >
          🌍 Our Carbon Footprint Calculator
        </Typography>
        <Typography
          variant="h6" // Subtitle with larger font
          sx={{
            color: "#455a64",
            maxWidth: 800,
            margin: "auto",
            mt: 2,
            px: 2,
            fontSize: { xs: "1rem", sm: "1.1rem" }, // Responsive font size
            lineHeight: 1.6, // Better readability
          }}
        >
          Take a step towards a greener future! 🌱 Our Carbon Footprint
          Calculator helps you measure the environmental impact of your daily
          activities. By understanding your carbon emissions, you can make
          informed decisions to reduce your footprint and contribute to a
          sustainable planet. Start your journey today! 🌿
        </Typography>
      </Box>

      {/* Calculator */}
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          margin: "auto",
          p: 4,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        {/* Tab Navigation */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          {["Primary", "Secondary", "Total"].map((tab) => (
            <Button
              key={tab}
              variant={
                activeTab === tab.toLowerCase() ? "contained" : "outlined"
              }
              onClick={() =>
                tab === "Total"
                  ? totalFootprint && setActiveTab("total")
                  : setActiveTab(tab.toLowerCase())
              }
              sx={{ 
                mx: 1 , 
                borderRadius: "50px",
              }}
              disabled={tab === "Total" && !totalFootprint}
            >
              {tab}
            </Button>
          ))}
        </Box>

        {/* Primary Fields */}
        {activeTab === "primary" && <Box>{renderFields(primaryFields)}</Box>}

        {/* Secondary Fields */}
        {activeTab === "secondary" && (
          <Box>{renderFields(secondaryFields)}</Box>
        )}

        {/* Next Button for Primary Tab */}
        {activeTab === "primary" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => setActiveTab("secondary")}
              sx={{ borderRadius: "50px" , padding: "10px 15px" }}
            >
              Next: Secondary Data
            </Button>
          </Box>
        )}

        {/* Calculate Button for Secondary Tab */}
        {activeTab === "secondary" && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Button
              variant="contained"
              size="small" // Smaller button size
              onClick={calculateFootprint}
              disabled={loading}
              sx={{ borderRadius: "50px" , padding: "10px 15px" }}
            >
              {loading ? "Calculating..." : "Calculate Results"}
            </Button>
          </Box>
        )}

        {/* Total Results */}
        {activeTab === "total" && totalFootprint && (
          <Box textAlign="center">
            <Typography variant="h5">Your Carbon Footprint</Typography>
            <Typography variant="h6">
              Total: {totalFootprint.Total.toFixed(2)} kg CO₂e
            </Typography>
            <Button variant="contained" onClick={getTips} sx={{ mt: 2 }}>
              Get Reduction Tips
            </Button>
          </Box>
        )}

        {/* Tips Modal */}
        <Modal open={tipsModalOpen} onClose={() => setTipsModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Reduction Tips</Typography>
              <IconButton onClick={() => setTipsModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {tipsData && (
              <Box mt={2}>
                <Typography>{tipsData.summary}</Typography>
                {tipsData.tips.map((tip, index) => (
                  <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                    {tip}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Modal>

        {/* Error Handling */}
        {(loginError || tipsError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {loginError || tipsError}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default Calculator;
