'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";
import Stepper from "../../components/Stepper";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const { dispatch } = useCart();

  useEffect(() => {
    if (params.id) {
      axios.get("/api/products").then(res => {
        const foundProduct = res.data.find((p: Product) => p.id === parseInt(params.id as string));
        setProduct(foundProduct);
        setLoading(false);
      });
    }
  }, [params.id]);

  const addToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url
          }
        });
      }
    }
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-heading mb-4">Product Not Found</h1>
          <Link href="/" className="text-accent hover:text-accent-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Stepper />
      
      <div className="mb-4">
        <Link href="/" className="text-body hover:text-accent transition-colors">
          ← Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="card overflow-hidden">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="card p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-heading mb-2">{product.name}</h1>
          </div>

          <div className="text-3xl font-bold text-accent">
            ${product.price}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-sm font-medium text-body">
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-primary focus-ring"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <button
              onClick={addToCart}
              className="w-full btn-primary"
            >
              Add to Cart
            </button>

            <Link
              href="/cart"
              className="block w-full btn-secondary text-center"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
