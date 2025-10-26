'use client'

import { usePathname } from 'next/navigation';

interface Step {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 'browse',
    name: 'Browse Items',
    description: 'Explore our products',
    path: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )
  },
  {
    id: 'view',
    name: 'View Details',
    description: 'Product information',
    path: '/product',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    id: 'cart',
    name: 'Review Cart',
    description: 'Check your items',
    path: '/cart',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
    )
  },
  {
    id: 'checkout',
    name: 'Checkout',
    description: 'Complete your order',
    path: '/checkout',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'complete',
    name: 'Order Complete',
    description: 'Thank you!',
    path: '/invoice',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
];

export default function Stepper() {
  const pathname = usePathname();
  
  const getCurrentStepIndex = () => {
    // More precise path matching
    if (pathname === '/') return 0; // Browse Items
    if (pathname.startsWith('/product/')) return 1; // View Details
    if (pathname === '/cart') return 2; // Review Cart
    if (pathname === '/checkout') return 3; // Checkout
    if (pathname.startsWith('/invoice/')) return 4; // Order Complete
    return 0; // Default to first step
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 text-white shadow-lg'
                          : isCurrent
                          ? 'bg-blue-500 text-white shadow-lg scale-110'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-6 left-12 w-full h-0.5 transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ width: 'calc(100% - 3rem)' }}
                      />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="mt-4 text-center max-w-24">
                    <h3
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        isCurrent
                          ? 'text-blue-600'
                          : isCompleted
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 transition-colors duration-300 ${
                        isCurrent
                          ? 'text-blue-500'
                          : isCompleted
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
