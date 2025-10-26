'use client'

import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Stepper from "../components/Stepper";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data for backend API
      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_contact: formData.email,
        total_amount: state.total + state.total * 0.08,
        items: state.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }))
      };

      // Call backend API to create order
      const response = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Store order data for invoice page
      const orderInfo = {
        orderId: result.order_id,
        items: state.items,
        total: state.total + state.total * 0.08,
        customerInfo: formData,
        orderDate: new Date().toISOString(),
        invoicePath: result.invoice
      };

      localStorage.setItem('lastOrder', JSON.stringify(orderInfo));

      // Clear cart
      dispatch({ type: 'CLEAR_CART' });

      // Redirect to invoice page
      router.push(`/invoice/${result.order_id}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Stepper />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-heading mb-4">Your Cart is Empty</h1>
          <p className="text-body mb-8 text-lg">Add some products to proceed to checkout!</p>
          <Link 
            href="/" 
            className="btn-primary text-lg px-8 py-4"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Stepper />
      <h1 className="text-3xl font-bold text-heading mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-heading mb-6">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-primary focus-ring"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-primary focus-ring"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-primary focus-ring"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-primary focus-ring"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-primary focus-ring"
                />
              </div>
            </div>
          </div>

        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-heading mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {state.items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${(state.total * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    ${(state.total + state.total * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>

            <Link
              href="/cart"
              className="block w-full btn-secondary text-center mt-4"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
