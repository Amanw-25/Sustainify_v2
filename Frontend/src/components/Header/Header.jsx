import React, { useState, useRef, useContext, createElement } from "react";
import { NavLink, Link } from "react-router-dom";
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
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import logo from "../../assets/images/Sustainify_logo.png";
import userImg from "../../assets/images/user.png";
import { Menu, MenuHandler, MenuList, MenuItem, Typography } from "@material-tailwind/react";
import { Box, IconButton, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { ColorModeContext, tokens } from "../../theme";

// Navigation Menu Items for Services Dropdown
const navListMenuItems = [
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

// Main Navigation Links
const navLinks = [
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

const Header = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const renderDropdownItems = navListMenuItems.map(({ icon, title, description, path }, key) => (
    <Link to={path} key={key}>
      <MenuItem className="flex items-center gap-3 rounded-lg w-full p-4 hover:bg-gray-100">
        <div className="flex items-center justify-center rounded-lg bg-pastelGreen-500 p-4">
          {createElement(icon, {
            strokeWidth: 2,
            className: "h-6 text-gray-900 w-6",
          })}
        </div>
        <div>
          <Typography
            variant="h6"
            color="blue-gray"
            className="flex items-center text-sm font-bold"
          >
            {title}
          </Typography>
          <Typography
            variant="paragraph"
            className="text-xs font-medium text-blue-gray-500"
          >
            {description}
          </Typography>
        </div>
      </MenuItem>
    </Link>
  ));

  return (
    <header className="header flex items-center py-0 px-4 bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <img
              src={logo}
              className="w-[100px] lg:w-[180px] h-auto"
              alt="Sustainify Logo"
            />
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center">
            <ul className="menu flex items-center gap-[2rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  {link.dropdown ? (
                    <Menu
                      open={isMenuOpen}
                      handler={setIsMenuOpen}
                      offset={{ mainAxis: 20, crossAxis: 50 }}
                      placement="bottom-start"
                      allowHover={true}
                    >
                      <MenuHandler>
                        <Typography
                          as="div"
                          variant="small"
                          className="text-lg font-Inter font-medium"
                        >
                          <div
                            className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900 cursor-pointer"
                          >
                            {link.display}
                            <FaAngleDown
                              className={`h-3 w-3 transition-transform ${
                                isMenuOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </Typography>
                      </MenuHandler>
                      <MenuList className="max-w-screen-xl bg-white rounded-xl shadow-lg">
                        <ul className="grid grid-cols-2 gap-y-2 outline-none">
                          {renderDropdownItems}
                        </ul>
                      </MenuList>
                    </Menu>
                  ) : (
                    <NavLink
                      to={link.path}
                      className={(navClass) =>
                        navClass.isActive
                          ? "text-primaryColor text-[16px] leading-7 font-[600]"
                          : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                      }
                    >
                      {link.display}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Box display="flex">
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon className="text-black" />
                ) : (
                  <LightModeOutlinedIcon className="text-black" />
                )}
              </IconButton>
            </Box>
            {/* Profile Icon */}
            <div className="hidden md:block">
              <Link>
                <figure className="w-[40px] h-[40px] border-2 border-red-300 rounded-full cursor-pointer overflow-hidden">
                  <img
                    src={userImg}
                    className="w-full h-full object-cover"
                    alt="User"
                  />
                </figure>
              </Link>
            </div>

            {/* Login Button */}
            <Link to="/login" className="hidden md:block">
              <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                Login
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <span
              className="md:hidden text-primaryColor cursor-pointer"
              onClick={toggleMenu}
            >
              <BiMenu className="w-6 h-6" />
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg z-50 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <img src={logo} className="w-[100px] h-auto" alt="Sustainify Logo" />
          <span className="text-gray-600 cursor-pointer" onClick={toggleMenu}>
            <AiOutlineClose className="w-6 h-6" />
          </span>
        </div>
        <ul className="flex flex-col space-y-4 pl-4">
          {navLinks.map((link, idx) => (
            <li key={idx}>
              {link.dropdown ? (
                <div>
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="text-textColor text-[16px] font-[600] flex items-center gap-2"
                  >
                    {link.display}
                    <FaAngleDown
                      className={`h-4 w-4 transition-transform ${
                        isMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isMenuOpen && (
                    <ul className="pl-4 mt-2">
                      {navListMenuItems.map((item, index) => (
                        <li key={index}>
                          <NavLink
                            to={item.path}
                            className="text-textColor text-[14px] font-[400] hover:text-primaryColor"
                            onClick={toggleMenu}
                          >
                            {item.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={link.path}
                  className="text-textColor text-[16px] font-[600] hover:text-primaryColor"
                  onClick={toggleMenu}
                >
                  {link.display}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-200">
          <Link to="/login">
            <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] w-full flex items-center justify-center rounded-[50px]">
              Login
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;