import React, { useState } from "react";
import { 
  Box, 
  IconButton, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider 
} from "@mui/material";
import { Link } from "react-router-dom";

// Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

// Generate random avatar
const generateRandomAvatar = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://i.pravatar.cc/150?u=${randomId}`;
};

const menuItems = [
  {
    title: "Dashboard",
    icon: <HomeOutlinedIcon />,
    to: "/dashboard"
  },
  {
    category: "Events",
    items: [
      { title: "Manage Request", icon: <PeopleOutlinedIcon />, to: "/event-approval" },
      { title: "Manage Event", icon: <ContactsOutlinedIcon />, to: "/event-manage" },
      { title: "Event Data", icon: <ReceiptOutlinedIcon />, to: "/event-data" },
      { title: "Event Calendar", icon: <MapOutlinedIcon />, to: "/event-calendar" }
    ]
  },
  {
    category: "Products",
    items: [
      { title: "Product Statistics", icon: <CalendarTodayOutlinedIcon />, to: "/product-stat" },
      { title: "ManageOrder", icon: <PersonOutlinedIcon />, to: "/manage-order" },
      { title: "Add Product", icon: <HelpOutlineOutlinedIcon />, to: "/add-product" }
    ]
  },
  {
    category: "Charts",
    items: [
      { title: "Product Bar Chart", icon: <BarChartOutlinedIcon />, to: "/bar" },
      { title: "Evnet Pie Chart", icon: <PieChartOutlineOutlinedIcon />, to: "/pie" },
      { title: "Subscription Line Chart", icon: <TimelineOutlinedIcon />, to: "/line" },
    ]
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const avatarUrl = generateRandomAvatar();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 70 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 70 : 240,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        overflow: 'hidden' 
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          p: 2 
        }}>
          {!collapsed && (
            <Typography variant="h5" fontWeight="bold">
              ADMIN
            </Typography>
          )}
          <IconButton 
            onClick={() => setCollapsed(!collapsed)}
            sx={{ ml: collapsed ? 0 : 'auto' }}
          >
            <MenuOutlinedIcon />
          </IconButton>
        </Box>

        {/* Profile */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 2 
        }}>
          <img 
            src={avatarUrl} 
            alt="User Avatar" 
            style={{ 
              width: 60, 
              height: 60, 
              borderRadius: '50%', 
              objectFit: 'cover' 
            }} 
          />
          {!collapsed && (
            <>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                Aman
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Admin
              </Typography>
            </>
          )}
        </Box>

        <Divider />

        {/* Scrollable Menu */}
        <Box sx={{ 
          overflowY: 'auto', 
          overflowX: 'hidden',
          flex: 1 
        }}>
          {menuItems.map((section, index) => (
            <React.Fragment key={index}>
              {section.category && !collapsed && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    px: 2, 
                    py: 1, 
                    color: 'text.secondary' 
                  }}
                >
                  {section.category}
                </Typography>
              )}
              <List>
                {section.items ? (
                  section.items.map((item) => (
                    <ListItem
                      key={item.title}
                      component={Link}
                      to={item.to}
                      selected={selectedItem === item.title}
                      onClick={() => setSelectedItem(item.title)}
                      sx={{
                        '& .MuiListItemIcon-root': {
                          minWidth: collapsed ? 'auto' : 56
                        }
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      {!collapsed && <ListItemText primary={item.title} />}
                    </ListItem>
                  ))
                ) : (
                  <ListItem
                    component={Link}
                    to={section.to}
                    selected={selectedItem === section.title}
                    onClick={() => setSelectedItem(section.title)}
                    sx={{
                      '& .MuiListItemIcon-root': {
                        minWidth: collapsed ? 'auto' : 56
                      }
                    }}
                  >
                    <ListItemIcon>{section.icon}</ListItemIcon>
                    {!collapsed && <ListItemText primary={section.title} />}
                  </ListItem>
                )}
              </List>
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;