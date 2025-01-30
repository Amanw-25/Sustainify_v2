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
import { Close as CloseIcon } from "@mui/icons-material";
import { primaryFields } from "./sections/content";
import { secondaryFields } from "./sections/content";
import { BASE_URL } from "../../../config";

const Calculator = () => {
  const token = localStorage.getItem("token");
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

      const response = await fetch(`${BASE_URL}/carbon/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

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

      const response = await fetch(`${BASE_URL}/carbon/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

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
                  borderColor: "#222222",
                },
                "&:hover fieldset": {
                  borderColor: "black", 
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
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
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          py: 6, 
          borderRadius: 2, 
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "#004d40",
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "3rem" },
            mb: 2, 
          }}
        >
          🌍 Our Carbon Footprint Calculator
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#455a64",
            maxWidth: 800,
            margin: "auto",
            mt: 2,
            px: 2,
            fontSize: { xs: "1rem", sm: "1.1rem" }, 
            lineHeight: 1.6,
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
                mx: 1,
                borderRadius: "50px",
              }}
              disabled={tab === "Total" && !totalFootprint}
            >
              {tab}
            </Button>
          ))}
        </Box>

        {activeTab === "primary" && <Box>{renderFields(primaryFields)}</Box>}

        {activeTab === "secondary" && (
          <Box>{renderFields(secondaryFields)}</Box>
        )}

        {activeTab === "primary" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => setActiveTab("secondary")}
              sx={{ borderRadius: "50px", padding: "10px 15px" }}
            >
              Next: Secondary Data
            </Button>
          </Box>
        )}

        {activeTab === "secondary" && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Button
              variant="contained"
              size="small"
              onClick={calculateFootprint}
              disabled={loading}
              sx={{ borderRadius: "50px", padding: "10px 15px" }}
            >
              {loading ? "Calculating..." : "Calculate Results"}
            </Button>
          </Box>
        )}

        {/* Total Results */}
        {activeTab === "total" && totalFootprint && (
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" mb="4px">
              Your Carbon Footprint
            </Typography>
            <Typography variant="h4">
              Primary: {totalFootprint.PrimaryTotal.toFixed(2)} kg CO₂e
            </Typography>
            <Typography variant="h4">
              Seconday: {totalFootprint.SecondaryTotal.toFixed(2)} kg CO₂e
            </Typography>
            <Typography variant="h4">
              Total: {totalFootprint.Total.toFixed(2)} kg CO₂e
            </Typography>
            <Button
              variant="contained"
              onClick={getTips}
              sx={{ mt: 2, borderRadius: "50px", padding: "10px 15px" }}
            >
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
              width: 800,
              height: 500,
              backgroundColor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h3" fontWeight="bold">
                Reduction Tips
              </Typography>
              <IconButton onClick={() => setTipsModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                mt: 2,
                pr: 2,
              }}
            >
              {tipsData && tipsData.data && (
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Following are the Personalized Insights:
                  </Typography>

                  {Object.entries(tipsData.data)
                    .filter(
                      ([_, tips]) =>
                        Array.isArray(tips) &&
                        tips.length > 0 &&
                        !tips.includes("No data available for this section")
                    )
                    .map(([category, tips]) => (
                      <Box key={category} mt={2}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {category.replace(/([A-Z])/g, " $1").trim()}:
                        </Typography>

                        <ol>
                          {tips.map((tip, index) => (
                            <li key={index}>
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  fontSize: "1rem",
                                }}
                              >
                                {index + 1}. {tip}
                              </Typography>
                            </li>
                          ))}
                        </ol>
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
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
