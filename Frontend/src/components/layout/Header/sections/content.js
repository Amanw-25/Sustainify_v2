import {
  FaCloudRain,
  FaLeaf,
  FaUsers,
  FaChartLine,
  FaTree,
  FaShoppingCart,
  FaCalculator,
  FaAngleDown,
} from "react-icons/fa";

export const navListMenuItems = [
  {
    title: "Weather",
    description: "Check the latest weather updates",
    icon: FaCloudRain,
    path: "/weather/:location",
  },
  {
    title: "Sustainable Practices",
    description: "Learn about sustainable practices",
    icon: FaLeaf,
    path: "/sustainable-practices",
  },
  {
    title: "Eco Community",
    description: "Join our eco-friendly community",
    icon: FaUsers,
    path: "/eco-community",
  },
  {
    title: "Market Trends",
    description: "Explore the latest market trends",
    icon: FaChartLine,
    path: "/market-trends",
  },
  {
    title: "Carbon Footprint",
    description: "Track your carbon footprint",
    icon: FaTree,
    path: "/carbon-footprint-tracker",
  },
  {
    title: "Eco Store",
    description: "Shop eco-friendly products",
    icon: FaShoppingCart,
    path: "/eco-store",
  },
  {
    title: "Carbon Calculator",
    description: "Calculate your carbon emissions",
    icon: FaCalculator,
    path: "/carbon-calculator",
  },
];

export const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About Us",
  },
  {
    path: "/services",
    display: "Services",
    dropdown: true, // Indicates this item has a dropdown
  },
  {
    path: "/contact",
    display: "Contact Us",
  },
];
