import React from 'react';
import CarouselComponent from './sections/Carousel';
import ProductGrid from '../../layout/EcoStore/sections/ProductGrid/ProductGrid';
import EcoCategories from './sections/EcoCategories';

const Store = () => {
  return (
    <div>
      <CarouselComponent />
      <EcoCategories />
      <ProductGrid />
    </div>
  );
};

export default Store;


