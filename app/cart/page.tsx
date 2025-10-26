'use client'

import Link from "next/link";
import { useCart } from "../contexts/CartContext";
import Stepper from "../components/Stepper";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity }
    });
  };

  const removeItem = (id: number) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: id
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Stepper />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-heading mb-4">Your Cart is Empty</h1>
          <p className="text-body mb-8 text-lg">Add some products to get started!</p>
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
      <h1 className="text-3xl font-bold text-heading mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            {state.items.map(item => (
              <div key={item.id} className="border-b border-gray-200 p-6 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-heading">{item.name}</h3>
                    <p className="text-body">${item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-accent-primary"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-accent-primary"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-heading">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-heading mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-body">Items ({state.itemCount})</span>
                <span className="font-semibold">${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body">Shipping</span>
                <span className="font-semibold success">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-body">Tax</span>
                <span className="font-semibold">${(state.total * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold text-accent">
                    ${(state.total + state.total * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full btn-primary text-center mb-4"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/"
              className="block w-full btn-secondary text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
