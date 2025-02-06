import { useState } from "react";
import { Box, IconButton, Typography, useTheme, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";
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

const SidebarItem = ({ title, to, icon, selected, setSelected, collapsed }) => {
  return (
    <ListItem button onClick={() => setSelected(title)} component={Link} to={to} selected={selected === title}>
      {icon}
      {!collapsed && <ListItemText primary={title} />}
    </ListItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Drawer state
  const [selected, setSelected] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false); // Collapsed state

  return (
    <Box sx={{ display: "flex" }}>
      {/* Drawer */}
      <Drawer
        sx={{
          width: collapsed ? 60 : 240, // Change width based on collapse state
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? 60 : 240,
            backgroundColor: "#ffffff", // White background for the sidebar
            color: "#333", // Dark text color
            borderRight: 0,
            boxShadow: collapsed ? "none" : "2px 0px 5px rgba(0,0,0,0.1)", // Add shadow when not collapsed
          },
        }}
        variant="permanent"
        anchor="left"
        open={isDrawerOpen}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* Logo and Toggle Button */}
          <Box sx={{ padding: "20px", display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h3" color={collapsed ? "#333" : "#000"} fontWeight="bold">
              ADMIN
            </Typography>
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlinedIcon />
            </IconButton>
          </Box>

          {/* Profile Image and Name */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
            <img
              alt="profile-user"
              width="60px"
              height="60px"
              src={`../public/user.jpg`}
              style={{ cursor: "pointer", borderRadius: "50%" }}
            />
            {!collapsed && (
              <>
                <Typography variant="h5" color="#333" fontWeight="bold" sx={{ marginTop: "10px" }}>
                  Aman
                </Typography>
                <Typography variant="h6" color="#388e3c">
                  Admin
                </Typography>
              </>
            )}
          </Box>

          <Divider />

          {/* Menu Items */}
          <List>
            <SidebarItem
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
            <Typography variant="h6" color="#333" sx={{ m: "15px 0 5px 20px" }}>
              Data
            </Typography>
            <SidebarItem
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
            <SidebarItem
              title="Contacts Information"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
            <SidebarItem
              title="Invoices Balances"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />

            <Typography variant="h6" color="#333" sx={{ m: "15px 0 5px 20px" }}>
              Pages
            </Typography>
            <SidebarItem
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
            <SidebarItem
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
            <SidebarItem
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />

            <Typography variant="h6" color="#333" sx={{ m: "15px 0 5px 20px" }}>
              Charts
            </Typography>
            <SidebarItem
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
            <SidebarItem
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
            <SidebarItem
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
            <SidebarItem
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              collapsed={collapsed}
            />
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "20px",
        }}
      >
        {/* Content goes here */}
        <Typography variant="h4">Welcome to the Admin Dashboard</Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
