import React, { useRef, useState } from "react";
import logo from "../../assets/images/Sustainify_logo.png";
import userImg from "../../assets/images/user.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/doctors",
    display: "Find a Doctor",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="header flex items-center py-0 px-6 bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <img
              src={logo}
              className="w-[120px] lg:w-[180px] h-auto"
              alt="Sustainify Logo"
            />
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center">
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
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
        } transition-transform duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <img src={logo} className="w-[100px] h-auto" alt="Sustainify Logo" />
          <span className="text-gray-600 cursor-pointer" onClick={toggleMenu}>
            <AiOutlineClose className="w-6 h-6" />
          </span>
        </div>
        <ul className="flex flex-col -space-y-6 pl-6">
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={(navClass) =>
                  navClass.isActive
                    ? "text-primaryColor text-[16px] font-[600]"
                    : "text-textColor text-[16px] font-[500] hover:text-primaryColor"
                }
                onClick={toggleMenu}
              >
                {link.display}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="p-6 border-t border-gray-200">
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
