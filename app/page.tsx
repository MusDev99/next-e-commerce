'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./contexts/CartContext";
import Stepper from "./components/Stepper";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();

  useEffect(() => {
    axios.get("/api/products").then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const addToCart = (product: Product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Stepper />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-heading mb-4">Welcome to Our Store</h1>
        <p className="text-lg text-body">Discover amazing products at great prices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <div key={product.id} className="card overflow-hidden hover:scale-105">
            <Link href={`/product/${product.id}`}>
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
              />
            </Link>
            <div className="p-6">
              <Link href={`/product/${product.id}`}>
                <h2 className="text-xl font-semibold text-heading mb-2 hover:text-accent transition-colors">
                  {product.name}
                </h2>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-accent">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
