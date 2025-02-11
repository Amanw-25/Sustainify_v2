import { useState, useEffect } from 'react';
import { BASE_URL } from '../config.js';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        
        if (data.status === "Success") {
          setProducts(data.products);
          const uniqueCategories = [...new Set(data.products.map(product => product.category))];
          setCategories(uniqueCategories);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, categories, loading, error };
};