import React from "react";
import { RiLinkedinFill } from "react-icons/ri";
import { AiFillGithub, AiOutlineInstagram } from "react-icons/ai";

export const socialLinks = [
  {
    path: "https://www.linkedin.com/in/amanwairagkar/",
    icon: React.createElement(RiLinkedinFill, {
      className: "group-hover:text-white w-4 h-5",
    }),
  },

  {
    path: "https://github.com/Amanw-25",
    icon: React.createElement(AiFillGithub, {
      className: "group-hover:text-white w-4 h-5",
    }),
  },

  {
    path: "https://www.instagram.com/Amanw_25",
    icon: React.createElement(AiOutlineInstagram, {
      className: "group-hover:text-white w-4 h-5",
    }),
  },
];

export const quickLinks01 = [
  {
    path: "/home",
    display: "Home",
  },

  {
    path: "/",
    display: "About Us",
  },

  {
    path: "/services",
    display: "Services",
  },

  {
    path: "/",
    display: "Blog",
  },
];

export const quickLinks02 = [
  {
    path: "/find-a-doctore",
    display: "Find a Doctor",
  },

  {
    path: "/",
    display: "Request an Appointment",
  },

  {
    path: "/",
    display: "Find a Location",
  },

  {
    path: "/",
    display: "Get a Opinion",
  },
];

export const quickLinks03 = [
  {
    path: "/",
    display: "Donate",
  },

  {
    path: "/contact",
    display: "Contact Us",
  },
];
