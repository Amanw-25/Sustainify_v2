import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Drawer, useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Sidebar from "../../layout/AdminDashboard/Global/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config.js";
import { ResponsiveLine } from "@nivo/line";

const Dashboard = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const [stats, setStats] = useState({
    totalUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    totalOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalAmount: 0,
    orderTrends: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(`${BASE_URL}/user/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const usersData = await usersResponse.json();
        
        const usersArray = usersData.users || [];
        const totalUsers = usersArray.length;
        const maleUsers = usersArray.filter(user => user.gender === "male").length;
        const femaleUsers = usersArray.filter(user => user.gender === "female").length;

        const ordersResponse = await fetch(`${BASE_URL}/checkout/getallorders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const ordersData = await ordersResponse.json();
        
        const ordersArray = ordersData.orders || [];
        const totalOrders = ordersArray.length;
        const processingOrders = ordersArray.filter(order => order.orderStatus === "processing").length;
        const shippedOrders = ordersArray.filter(order => order.orderStatus === "shipped").length;
        const deliveredOrders = ordersArray.filter(order => order.orderStatus === "delivered").length;
        const totalAmount = ordersArray.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const ordersByDate = {};
        ordersArray.forEach(order => {
          const date = new Date(order.createdAt).toLocaleDateString();
          if (!ordersByDate[date]) {
            ordersByDate[date] = 0;
          }
          ordersByDate[date] += order.totalAmount || 0;
        });

        const orderTrends = Object.keys(ordersByDate).map(date => ({
          x: date,
          y: ordersByDate[date],
        })).sort((a, b) => new Date(a.x) - new Date(b.x));

        setStats({
          totalUsers,
          maleUsers,
          femaleUsers,
          totalOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          totalAmount,
          orderTrends: [{ id: "Revenue", data: orderTrends }],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const statsCards = [
    { title: "Total Users", count: stats.totalUsers, color: "#3b82f6" },
    { title: "Male Users", count: stats.maleUsers, color: "#10b981" },
    { title: "Female Users", count: stats.femaleUsers, color: "#f43f5e" },
    { title: "Total Orders", count: stats.totalOrders, color: "#6366f1" },
    { title: "Processing Orders", count: stats.processingOrders, color: "#f59e0b" },
    { title: "Shipped Orders", count: stats.shippedOrders, color: "#8b5cf6" },
    { title: "Delivered Orders", count: stats.deliveredOrders, color: "#ec4899" },
    { title: "Total Revenue", count: `₹${stats.totalAmount.toLocaleString()}`, color: "#14b8a6" }
  ];

  // Get a simplified subset of data for mobile view to avoid crowding
  const getMobileChartData = () => {
    if (!stats.orderTrends[0] || !stats.orderTrends[0].data) return stats.orderTrends;
    
    const fullData = stats.orderTrends[0].data;
    
    // If we have more than 5 data points, reduce them for mobile
    if (fullData.length > 5) {
      // Get approximately 5 evenly spaced data points
      const step = Math.ceil(fullData.length / 5);
      const simplifiedData = [];
      
      for (let i = 0; i < fullData.length; i += step) {
        if (simplifiedData.length < 5) {
          simplifiedData.push(fullData[i]);
        }
      }
      
      // Always include the last data point
      if (simplifiedData[simplifiedData.length - 1] !== fullData[fullData.length - 1]) {
        simplifiedData.push(fullData[fullData.length - 1]);
      }
      
      return [{ id: "Revenue", data: simplifiedData }];
    }
    
    return stats.orderTrends;
  };

  return (
    <Box sx={{ 
      display: "flex", 
      height: "100vh", 
      backgroundColor: "#ffffff", 
      margin: 0, 
      padding: 0,
      width: "100%",
      overflow: "hidden"
    }}>
      {isMobile && (
        <IconButton
          onClick={() => setSidebarOpen(true)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1000,
            backgroundColor: "white",
            boxShadow: 3,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Box sx={{ width: 240, flexShrink: 0 }}>
          <Sidebar />
        </Box>
      )}

      <Drawer 
        anchor="left" 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
          },
        }}
      >
        <Box sx={{ width: 240 }}>
          <Sidebar />
        </Box>
      </Drawer>

      <Box sx={{ 
        flex: 1, 
        width: "100%", 
        padding: isMobile ? 1 : 2,
        paddingTop: isMobile ? "60px" : 2, // Increased top padding on mobile
        height: "100vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          width: "100%",
          flexShrink: 0
        }}>
          <Typography
            variant={isMobile ? "h5" : "h3"}
            fontWeight="bold"
            color="primary"
          >
            Admin Dashboard
          </Typography>
          <IconButton
            onClick={handleLogout}
            color="primary"
          >
            <LogoutIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: isMobile ? "center" : "flex-start",
            width: "100%",
            flexShrink: 0
          }}
        >
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: stat.color,
                color: "#fff",
                width: isMobile ? "calc(50% - 8px)" : "calc(25% - 12px)",
                height: "90px",
                flexShrink: 0,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ 
                textAlign: "center",
                padding: "12px !important",
              }}>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>{stat.title}</Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                  {stat.count}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Graph container with fixed height on mobile */}
        <Box
          sx={{
            mt: 3,
            p: isMobile ? 1 : 2,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            flex: 1,
            width: "100%",
            minHeight: isMobile ? "350px" : "400px", // Set minimum height
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ 
              mb: 1, 
              textAlign: "center", 
              flexShrink: 0 
            }}
          >
            Revenue Trend
          </Typography>
          
          {/* Chart wrapper with fixed height */}
          <Box sx={{ 
            height: isMobile ? "320px" : "100%", 
            minHeight: isMobile ? "320px" : "300px",
            width: "100%",
            position: "relative" // Important for positioning
          }}>
            <ResponsiveLine
              data={isMobile ? getMobileChartData() : stats.orderTrends}
              margin={{ 
                top: 20, 
                right: 20, 
                bottom: isMobile ? 80 : 60, // Increased bottom margin for mobile
                left: isMobile ? 50 : 60  // Increased left margin for better y-axis visibility
              }}
              xScale={{ 
                type: "point"
              }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: false,
                reverse: false,
              }}
              curve="monotoneX"
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: isMobile ? 45 : 0, // Rotate labels on mobile
                legend: "Date",
                legendPosition: "middle",
                legendOffset: 50,
                format: (value) => isMobile ? value.split('/').slice(0, 2).join('/') : value, // Shorten date format on mobile
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Revenue (₹)",
                legendPosition: "middle",
                legendOffset: -40,
                tickValues: isMobile ? 4 : undefined, // Limit tick values on mobile
                format: value => 
                  isMobile && value > 1000 
                    ? `${Math.floor(value/1000)}K` 
                    : value.toString(), // Format large numbers for readability
              }}
              colors={{ scheme: "category10" }} // Changed color scheme for better visibility
              lineWidth={3} // Thicker lines
              pointSize={isMobile ? 6 : 10}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabelYOffset={-12}
              enableGridX={false}
              enableArea={true}
              areaOpacity={0.15}
              enableSlices="x"
              sliceTooltip={({ slice }) => {
                return (
                  <div
                    style={{
                      background: 'white',
                      padding: '9px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                    }}
                  >
                    <div style={{ marginBottom: '5px' }}><strong>{slice.points[0].data.x}</strong></div>
                    {slice.points.map(point => (
                      <div
                        key={point.id}
                        style={{
                          color: point.serieColor,
                          padding: '3px 0',
                        }}
                      >
                        <strong>₹{point.data.y.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                )
              }}
              theme={{
                axis: {
                  legend: {
                    text: {
                      fontSize: isMobile ? 11 : 14,
                      fontWeight: 'bold',
                    }
                  },
                  ticks: {
                    text: {
                      fontSize: isMobile ? 9 : 12,
                      fontWeight: 'bold',
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: '#dddddd',
                    strokeDasharray: '4 4',
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;