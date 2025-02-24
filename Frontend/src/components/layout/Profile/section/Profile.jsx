import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Container,
  Avatar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaVenusMars,
} from "react-icons/fa";
import { BASE_URL } from "../../../../config";
import uploadImageToCloudinary from "../../../../utils/uploadCloudinary.js";
import { toast } from "react-toastify";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          profilePhoto: data.user.profilePhoto || "/default-profile.png",
          gender: data.user.gender || "",
          password: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await uploadImageToCloudinary(file);
      setFormData({ ...formData, profilePhoto: data.url });
      toast.success("Profile picture updated!");
    } catch (error) {
      setError("Failed to upload image");
      console.log("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={submitHandler}
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ position: "relative" }}>
          <Avatar
            src={formData.profilePhoto}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Button
            component="label"
            variant="contained"
            sx={{
              position: "absolute",
              bottom: 0,
              right: -10,
              minWidth: "auto",
              width: 40,
              height: 40,
              borderRadius: "50%",
            }}
          >
            <FaCamera />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </Button>
        </Box>

        <TextField
          fullWidth
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <FaUser style={{ marginRight: 8 }} />,
          }}
          required
        />

        <TextField
          fullWidth
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <FaEnvelope style={{ marginRight: 8 }} />,
          }}
          required
        />

        <TextField
          fullWidth
          name="password"
          type="password"
          label="New Password (leave blank to keep current)"
          value={formData.password}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <FaLock style={{ marginRight: 8 }} />,
          }}
        />

        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            startAdornment={<FaVenusMars style={{ marginRight: 8 }} />}
          >
            <MenuItem value="">Select Gender</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.5,
            bgcolor: "#181A1E",
            "&:hover": {
              bgcolor: "#2c2f33",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update Profile"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
