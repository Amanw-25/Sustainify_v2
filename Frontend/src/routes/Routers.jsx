import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Signup from '../components/pages/Signup';
import Contact from '../components/pages/Contact';
import CarbonFootprint from '../components/pages/CarbonFootprint';
import Profile from '../components/layout/Profile/Profile';

import EcoStore from '../components/pages/Eco-Store';
import ProductDetails from '../components/layout/EcoStore/sections/ProductDetails/ProductDetails';
import CheckoutSuccess from '../components/layout/EcoStore/sections/Checkout/CheckOutSession';

import Blog from "../components/layout/EcoPractice/blogPage";
import BlogDetails from '../components/layout/EcoPractice/sections/BlogDetails/BlogDetails';
import TextEditor from '../components/layout/EcoPractice/sections/Post/TextEditor';
import PreviewAndPublish from '../components/layout/EcoPractice/sections/Post/PreviewAndPublish';
import SubscriptionSuccess from '../components/layout/EcoPractice/sections/BlogDetails/SubscriptionSuccess';

import Event from '../components/pages/Event';
import EventsDetails from '../components/layout/Events/section/Event/EventDetails';
import BadgeView from '../components/layout/Profile/section/BadgeView';



import Dashboard from '../components/layout/AdminDashboard/Dashboard';
import AdminApproval from '../components/layout/AdminDashboard/Events/EventApproval';
import ManageEvent from '../components/layout/AdminDashboard/Events/ManageEvent';
import EventData from '../components/layout/AdminDashboard/Events/EventData';
import EventCalendar from '../components/layout/AdminDashboard/Events/EventCalendar';
import ManageOrder from '../components/layout/AdminDashboard/Product/ManageOrder';
import ProductStat from '../components/layout/AdminDashboard/Product/ProductStat';
import AddProduct from '../components/layout/AdminDashboard/Product/AddProduct';
import BlogStatistics from '../components/layout/AdminDashboard/Blog/BlogStatistics';
import ManageBlog from '../components/layout/AdminDashboard/Blog/ManageBlog';

const Routers = () => {
  const { role } = useContext(AuthContext); // Get user role

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/badges/:badgeId" element={<BadgeView />} />


      <Route path="/eco-store" element={<EcoStore />} />
      <Route path="/carbon-footprint-tracker" element={<CarbonFootprint />} /> 
      <Route path="/eco-store/:id" element={<ProductDetails />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />


      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/post-article" element={<TextEditor />} />
      <Route path="/post-article/:postId/preview" element={<PreviewAndPublish />} />
      <Route path="/subscription-success" element={<SubscriptionSuccess />} />


      <Route path="/event" element={<Event />} />
      <Route path="/event-details/:id" element={<EventsDetails />} />



      {/* Admin Only Routes */}
      <Route path="/dashboard" element={role === "admin" ? <Dashboard /> : <Navigate to="/" />} />
      
      <Route path="/event-approval" element={role === "admin" ? <AdminApproval /> : <Navigate to="/" />} />
      <Route path="/event-manage" element={role === "admin" ? <ManageEvent /> : <Navigate to="/" />} />
      <Route path="/event-data" element={role === "admin" ? <EventData /> : <Navigate to="/" />} />
      <Route path="/event-calendar" element={role === "admin" ? <EventCalendar /> : <Navigate to="/" />} />

      <Route path="/manage-order" element={role === "admin" ? <ManageOrder /> : <Navigate to="/" />} />
      <Route path="/product-statistics" element={role === "admin" ? <ProductStat /> : <Navigate to="/" />} />
      <Route path="/manage-product" element={role === "admin" ? <AddProduct /> : <Navigate to="/" />} />

      <Route path="/blog-data" element={role === "admin" ? <BlogStatistics /> : <Navigate to="/" />} />
      <Route path="/manage-blog" element={role === "admin" ? <ManageBlog /> : <Navigate to="/" />} />


      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Routers;
