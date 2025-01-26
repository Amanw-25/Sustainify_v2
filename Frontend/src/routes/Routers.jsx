import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Signup from '../components/pages/Signup';
import Contact from '../components/pages/Contact';
import CarbonFootprint from '../components/pages/CarbonFootprint';
import EcoStore from '../components/pages/Eco-Store';


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
    </Routes>
  );
};

export default Routers;