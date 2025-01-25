import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Contact from '../pages/Contact';
// import Weather from '../pages/Weather';
// import SustainablePractices from '../pages/SustainablePractices';
// import EcoCommunity from '../pages/EcoCommunity';
// import MarketTrends from '../pages/MarketTrends';
import CarbonFootprint from '../pages/Calculator/Calculator';
// import EcoStore from '../pages/EcoStore';
// import CarbonCalculator from '../pages/CarbonCalculator';

const Routers = () => {
  return (
    <Routes>
      {/* Default and Home Route */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />

      {/* Contact Route */}
      <Route path="/contact" element={<Contact />} />

      {/* Services Routes */}
      {/* <Route path="/weather/:location" element={<Weather />} />
      <Route path="/sustainable-practices" element={<SustainablePractices />} />
      <Route path="/eco-community" element={<EcoCommunity />} />
      <Route path="/market-trends" element={<MarketTrends />} />
      <Route path="/carbon-footprint-tracker" element={<CarbonFootprint />} />
      <Route path="/eco-store" element={<EcoStore />} />
      <Route path="/carbon-calculator" element={<CarbonCalculator />} /> */}

      <Route path="/carbon-footprint-tracker" element={<CarbonFootprint />} /> 
    </Routes>
  );
};

export default Routers;