import { NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export async function GET() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/products');
    
    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }
    
    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products from backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products from backend' },
      { status: 500 }
    );
  }
}
