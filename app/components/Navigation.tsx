'use client'

import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

export default function Navigation() {
  const { state } = useCart();

  return (
    <nav className="nav-clean">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-heading">
              E-Commerce Store
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-body hover:text-accent transition-colors font-medium"
            >
              Home
            </Link>
            
            <Link 
              href="/cart" 
              className="relative text-body hover:text-accent transition-colors p-2 rounded-lg hover:bg-gray-50"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
                />
              </svg>
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                  {state.itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
