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
    title: "Sustainable Practices",
    description: "Learn about sustainable practices",
    icon: FaLeaf,
    path: "/blog",
  },
  {
    title: "Eco Events",
    description: "Join eco-friendly events",
    icon: FaUsers,
    path:'/event',
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

];

export const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "about",
    display: "About Us",
  },
  {
    path: "/services",
    display: "Services",
    dropdown: true, 
  },
  {
    path: "/contact",
    display: "Contact Us",
  },
];
