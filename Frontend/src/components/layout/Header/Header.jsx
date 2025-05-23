import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import logo from "../../../assets/images/Sustainify_logo.png";
import userImg from "../../../assets/images/user.png";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from "@material-tailwind/react";
import { useMediaQuery, useTheme } from "@mui/material";
import { createElement } from "react";
import { navListMenuItems, navLinks } from "./sections/content";
import { BASE_URL } from "../../../config";

const Header = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
      
      if (!currentToken) {
        setProfilePhoto(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check for token changes in this tab
    const checkToken = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        setToken(currentToken);
        if (!currentToken) {
          setProfilePhoto(null);
        }
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkToken);
    };
  }, [token]);

  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setProfilePhoto(null);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            setToken(null);
            setProfilePhoto(null);
          }
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        if (data.user && data.user.profilePhoto) {
          setProfilePhoto(data.user.profilePhoto);
        } else {
          setProfilePhoto(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [token]);

  // Handle click outside mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // Render profile photo or login button based on token presence
  const renderUserAction = () => {
    if (!token) {
      return (
        <Link to="/login" className="hidden md:block">
          <button className="bg-primaryColor py-2 px-4 md:px-6 text-white text-sm md:text-base font-[600] h-[40px] md:h-[44px] flex items-center justify-center rounded-[50px] transition-transform hover:scale-105">
            Login
          </button>
        </Link>
      );
    } else {
      return (
        <div
          onClick={handleProfileClick}
          className="hidden md:block cursor-pointer"
        >
          <figure className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] border-2 border-gray-300 rounded-full overflow-hidden transition-transform hover:scale-105">
            <img
              src={profilePhoto || userImg}
              className="w-full h-full object-cover"
              alt="User Profile"
            />
          </figure>
        </div>
      );
    }
  };

  const renderDropdownItems = navListMenuItems.map(
    ({ icon, title, description, path }, key) => (
      <Link to={path} key={key} className="w-full">
        <MenuItem className="flex items-center gap-3 rounded-lg w-full p-4 hover:bg-gray-100">
          <div className="flex items-center justify-center rounded-lg bg-pastelGreen-500 p-4">
            {createElement(icon, {
              strokeWidth: 2,
              className: "h-6 text-gray-900 w-6",
            })}
          </div>
          <div className="flex-1 min-w-0">
            <Typography
              variant="h6"
              color="blue-gray"
              className="flex items-center text-sm font-bold truncate"
            >
              {title}
            </Typography>
            <Typography
              variant="paragraph"
              className="text-xs font-medium text-blue-gray-500 truncate"
            >
              {description}
            </Typography>
          </div>
        </MenuItem>
      </Link>
    )
  );

  return (
    <header className="header fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md border-b border-gray-200 ">
      <div className="container mx-auto px-4 py-2 md:py-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src={logo}
                className="w-[90px] md:w-[140px] lg:w-[180px] h-auto"
                alt="Sustainify Logo"
              />
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center flex-1 justify-center">
            <ul className="flex items-center gap-6 lg:gap-8">
              {navLinks.map((link, index) => (
                <li key={index} className="relative">
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
                          className="text-base lg:text-lg font-Inter font-medium"
                        >
                          <div className="flex items-center gap-1 py-2 pr-4 font-medium text-gray-900 cursor-pointer">
                            {link.display}
                            <FaAngleDown
                              className={`h-3 w-3 transition-transform ${
                                isMenuOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </Typography>
                      </MenuHandler>
                      <MenuList className="max-w-screen-xl bg-white rounded-xl shadow-lg z-[999999]">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 outline-none">
                          {renderDropdownItems}
                        </ul>
                      </MenuList>
                    </Menu>
                  ) : (
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `text-[16px] leading-7 font-[500] transition-colors ${
                          isActive
                            ? "text-primaryColor font-[600]"
                            : "text-textColor hover:text-primaryColor"
                        }`
                      }
                    >
                      {link.display}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Conditionally render login button or profile photo */}
            {renderUserAction()}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-primaryColor p-2"
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
            >
              <BiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-lg z-[9999] transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <img src={logo} className="w-[120px] h-auto" alt="Sustainify Logo" />
          <button
            className="text-gray-600 p-2"
            onClick={toggleMenu}
            aria-label="Close mobile menu"
          >
            <AiOutlineClose className="w-6 h-6" />
          </button>
        </div>

        {token ? (
          <div className="p-4 border-b border-gray-200">
            <div
              onClick={() => {
                handleProfileClick();
                toggleMenu();
              }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <figure className="w-[45px] h-[45px] border-2 border-gray-300 rounded-full overflow-hidden">
                <img
                  src={profilePhoto || userImg}
                  className="w-full h-full object-cover"
                  alt="User Profile"
                />
              </figure>
              <span className="text-gray-800 font-medium">My Profile</span>
            </div>
          </div>
        ) : null}

        <nav className="p-4">
          <ul className="flex flex-col space-y-4">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      className="text-gray-800 text-[16px] font-[600] flex items-center gap-2 w-full"
                    >
                      {link.display}
                      <FaAngleDown
                        className={`h-4 w-4 transition-transform ${
                          mobileDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileDropdownOpen && (
                      <ul className="pl-4 mt-2 space-y-2">
                        {navListMenuItems.map((item, index) => (
                          <li key={index}>
                            <NavLink
                              to={item.path}
                              className="text-gray-600 text-[14px] font-[400] hover:text-primaryColor block py-1"
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
                    className={({ isActive }) =>
                      `block text-[16px] font-[600] ${
                        isActive
                          ? "text-primaryColor"
                          : "text-gray-800 hover:text-primaryColor"
                      }`
                    }
                    onClick={toggleMenu}
                  >
                    {link.display}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {!token && (
          <div className="p-4 border-t border-gray-200">
            <Link to="/login" onClick={toggleMenu}>
              <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] w-full flex items-center justify-center rounded-[50px] transition-transform hover:scale-105">
                Login
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
          onClick={toggleMenu}
        />
      )}
    </header>
  );
};

export default Header;