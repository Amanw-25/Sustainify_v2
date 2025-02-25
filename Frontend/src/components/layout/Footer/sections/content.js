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
    path: "/about",
    display: "About Sustainify",
  },

  {
    path: "/shop",
    display: "Shop Sustainable",
  },

  {
    path: "/blog",
    display: "Eco Blog",
  },
];

export const quickLinks02 = [
  {
    path: "/categories",
    display: "Browse Categories",
  },

  {
    path: "/impact",
    display: "Our Impact",
  },

  {
    path: "/recycling",
    display: "Recycling Guide",
  },

  {
    path: "/community",
    display: "Join Community",
  },
];

export const quickLinks03 = [
  {
    path: "/donate",
    display: "Support Sustainability",
  },

  {
    path: "/contact",
    display: "Contact Us",
  },

  {
    path: "/faq",
    display: "FAQs",
  },
];
