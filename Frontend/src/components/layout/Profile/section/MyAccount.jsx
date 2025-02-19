import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../../../config.js";
import Error from "../../../../Error/Error.jsx";
import Loading from "../../../../Loader/Loading.jsx";
import { toast } from "react-toastify";
import Profile from "./Profile";
import ProductOrders from "./ProductOrders";
import CarbonFootprint from "./CarbonFootprint";
import SavedBlogs from "./SavedBlogs";
import Events from "./Events";
import { useNavigate } from "react-router-dom";
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
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
} from '@mui/material';
import {
  MdCalendarToday,
  MdSettings,
  MdShoppingBag,
  MdEco,
  MdBookmark,
  MdEvent,
  MdLogout,
  MdDelete,
  MdMenu,
  MdClose
} from 'react-icons/md';

const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const [tab, setTab] = useState("settings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const Navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    Navigate("/home");
    setUserData(null);
  };

  const menuItems = [
    { id: 'settings', label: 'Profile Settings', icon: MdSettings },
    { id: 'orders', label: 'Product Orders', icon: MdShoppingBag },
    { id: 'carbon', label: 'Carbon Footprint', icon: MdEco },
    { id: 'blogs', label: 'Liked/Saved Blogs', icon: MdBookmark },
    { id: 'events', label: 'Events', icon: MdEvent },
  ];

  const handleTabChange = (tabId) => {
    setTab(tabId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, p: 2 }}>
        {isMobile && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)}>
              <MdClose />
            </IconButton>
          </Box>
        )}
        <Avatar
          src={userData?.user.profilePhoto || "/default-profile.png"}
          sx={{ 
            width: { xs: 80, sm: 100 }, 
            height: { xs: 80, sm: 100 }, 
            border: 2, 
            borderColor: 'primary.main', 
            mb: 2 
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center' }}>
          {userData?.user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', wordBreak: 'break-word' }}>
          {userData?.user.email}
        </Typography>
      </Box>

      <Box sx={{ px: 2, mb: 3 }}>
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
      </Box>

      <Divider sx={{ my: 2 }} />

      <List sx={{ p: 0, px: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem
              key={item.id}
              onClick={() => handleTabChange(item.id)}
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
    </>
  );

  if (loading) return <Loading />;
  if (error) return <Error errorMessage={error} />;

  return (
    <Box sx={{ maxWidth: '1170px', mx: 'auto', mt: { xs: 2, sm: 3, md: 5 }, px: { xs: 1, sm: 2 } }}>
      {userData && (
        <>
          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ mb: 2 }}>
              <IconButton 
                onClick={() => setMobileOpen(true)}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <MdMenu />
              </IconButton>
            </Box>
          )}

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, 
            gap: { xs: 2, md: 3 } 
          }}>
            {/* Sidebar - Desktop */}
            {!isMobile && (
              <Paper elevation={3} sx={{ height: 'fit-content' }}>
                <SidebarContent />
              </Paper>
            )}

            {/* Sidebar - Mobile Drawer */}
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              sx={{
                '& .MuiDrawer-paper': {
                  width: '100%',
                  maxWidth: '300px',
                  boxSizing: 'border-box',
                }
              }}
            >
              <SidebarContent />
            </Drawer>

            {/* Content Section */}
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
              {tab === "settings" && <Profile user={userData} />}
              {tab === "orders" && <ProductOrders user={userData} />}
              {tab === "carbon" && <CarbonFootprint user={userData} />}
              {tab === "blogs" && <SavedBlogs user={userData} />}
              {tab === "events" && <Events user={userData} />}
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MyAccount;