import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../../config.js";
import Error from "../../../../Error/Error.jsx";
import Loading from "../../../../Loader/Loading.jsx";
import { toast } from "react-toastify";
import Profile from "./Profile";
import ProductOrders from "./ProductOrders";
import CarbonFootprint from "./CarbonFootprint";
import SavedBlogs from "./SavedBlogs";
import { useNavigate } from "react-router-dom";
import Events from "./Events";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  MdCalendarToday,
  MdSettings,
  MdShoppingBag,
  MdEco,
  MdBookmark,
  MdEvent,
  MdLogout,
  MdDelete
} from 'react-icons/md';

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const [tab, setTab] = useState("settings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user data.");

        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    Navigate("/home")
    setUserData(null);
  };

  const menuItems = [
    { id: 'settings', label: 'Profile Settings', icon: MdSettings },
    { id: 'orders', label: 'Product Orders', icon: MdShoppingBag },
    { id: 'carbon', label: 'Carbon Footprint', icon: MdEco },
    { id: 'blogs', label: 'Liked/Saved Blogs', icon: MdBookmark },
    { id: 'events', label: 'Events', icon: MdEvent },
  ];

  if (loading) return <Loading />;
  if (error) return <Error errorMessage={error} />;

  return (
    <Box sx={{ maxWidth: '1170px', mx: 'auto', mt: 5, px: 2 }}>
      {userData && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { md: '300px 1fr' }, gap: 3 }}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={userData.user.profilePhoto || "/default-profile.png"}
                sx={{ width: 100, height: 100, border: 2, borderColor: 'primary.main', mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {userData.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.user.email}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogout}
                startIcon={<MdLogout />}
                sx={{ mb: 1 }}
              >
                Logout
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<MdDelete />}
              >
                Delete Account
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Navigation Menu */}
            <List sx={{ p: 0 }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <ListItem
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      cursor: 'pointer',
                      backgroundColor: tab === item.id ? '#0066ff' : 'transparent',
                      color: tab === item.id ? 'white' : 'text.primary',
                      '&:hover': {
                        backgroundColor: tab === item.id ? '#0066ff' : '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40,
                        color: tab === item.id ? 'white' : '#0066ff',
                      }}
                    >
                      <Icon size={22} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        sx: { 
                          fontWeight: tab === item.id ? 600 : 400
                        }
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>

          {/* Content Section */}
          <Paper elevation={3} sx={{ p: 3 }}>
            {tab === "settings" && <Profile user={userData} />}
            {tab === "orders" && <ProductOrders user={userData} />}
            {tab === "carbon" && <CarbonFootprint user={userData} />}
            {tab === "blogs" && <SavedBlogs user={userData} />}
            {tab === "events" && <Events user={userData} />}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default MyAccount;
