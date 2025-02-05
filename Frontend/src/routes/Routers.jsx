import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Signup from '../components/pages/Signup';
import Contact from '../components/pages/Contact';
import CarbonFootprint from '../components/pages/CarbonFootprint';
import EcoStore from '../components/pages/Eco-Store';
import ProductDetails from '../components/layout/EcoStore/sections/ProductDetails/ProductDetails';
import Blog from "../components/layout/EcoPractice/blogPage";
import BlogDetails from '../components/layout/EcoPractice/sections/BlogDetails/BlogDetails';
import TextEditor from '../components/layout/EcoPractice/sections/Post/TextEditor';
import PreviewAndPublish from '../components/layout/EcoPractice/sections/Post/PreviewAndPublish';
import Event from '../components/pages/Event';
import AdminPage from '../components/pages/AdminPage';



const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/eco-store" element={<EcoStore />} />
      <Route path="/carbon-footprint-tracker" element={<CarbonFootprint />} /> 
      <Route path="/eco-store/:id" element={<ProductDetails />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/post-article" element={<TextEditor />} />
      <Route path="/post-article/:postId/preview" element={<PreviewAndPublish />} />

      <Route path="/event" element={<Event />} />
      <Route path="/admin" element={<AdminPage />} />

    </Routes>
  );
};

export default Routers;