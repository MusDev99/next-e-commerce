'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import jsPDF from 'jspdf';
import Stepper from "../../components/Stepper";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  product_image_url: string;
  quantity: number;
  subtotal: number;
}

interface OrderData {
  id: number;
  customer_name: string;
  customer_contact: string;
  total_amount: number;
  invoice_path: string;
  created_at: string;
  items: OrderItem[];
}

export default function InvoicePage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!params.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/orders/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`Order not found: ${response.status}`);
        }
        
        const order = await response.json();
        setOrderData(order);
      } catch (error) {
        console.error('Error fetching order:', error);
        // Fallback to localStorage if API fails
        const storedOrder = localStorage.getItem('lastOrder');
        if (storedOrder) {
          const localOrder = JSON.parse(storedOrder);
          if (localOrder.orderId === params.id) {
            // Convert localStorage format to match backend format
            const convertedOrder: OrderData = {
              id: parseInt(params.id as string),
              customer_name: `${localOrder.customerInfo.firstName} ${localOrder.customerInfo.lastName}`,
              customer_contact: localOrder.customerInfo.email,
              total_amount: localOrder.total,
              invoice_path: localOrder.invoicePath || '',
              created_at: localOrder.orderDate,
              items: localOrder.items.map((item: any) => ({
                id: item.id,
                product_id: item.id,
                product_name: item.name,
                product_price: item.price,
                product_image_url: item.image_url,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
              }))
            };
            setOrderData(convertedOrder);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [params.id]);

  const generatePDF = () => {
    if (!orderData) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('E-Commerce Store', 20, 30);
    doc.setFontSize(16);
    doc.text('Invoice', 20, 45);
    
    // Order details
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderData.id}`, 20, 60);
    doc.text(`Order Date: ${new Date(orderData.created_at).toLocaleDateString()}`, 20, 70);
    
    // Customer information
    doc.text('Bill To:', 20, 90);
    doc.text(orderData.customer_name, 20, 100);
    doc.text(orderData.customer_contact, 20, 110);
    
    // Items table header
    doc.text('Items', 20, 130);
    doc.text('Quantity', 100, 130);
    doc.text('Price', 130, 130);
    doc.text('Total', 160, 130);
    
    // Items
    let yPosition = 140;
    orderData.items.forEach(item => {
      doc.text(item.product_name, 20, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(`$${item.product_price.toFixed(2)}`, 130, yPosition);
      doc.text(`$${item.subtotal.toFixed(2)}`, 160, yPosition);
      yPosition += 10;
    });
    
    // Total
    doc.setFontSize(14);
    doc.text(`Total: $${orderData.total_amount.toFixed(2)}`, 130, yPosition + 10);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 20, yPosition + 30);
    
    // Save the PDF
    doc.save(`invoice-${orderData.id}.pdf`);
  };

  const downloadBackendInvoice = () => {
    if (!orderData?.invoice_path) return;
    
    // Create a link to download the backend-generated invoice
    const link = document.createElement('a');
    link.href = `http://127.0.0.1:8000/${orderData.invoice_path}`;
    link.download = `invoice-${orderData.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Stepper />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Stepper />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-heading mb-4">Invoice Not Found</h1>
          <p className="text-body mb-8 text-lg">The requested invoice could not be found.</p>
          <Link 
            href="/" 
            className="btn-primary text-lg px-8 py-4"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Stepper />
      <div className="card p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-heading">Invoice</h1>
            <p className="text-body text-lg">Order ID: {orderData.id}</p>
            <p className="text-body text-lg">Date: {new Date(orderData.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-3">
            {orderData.invoice_path && (
              <button
                onClick={downloadBackendInvoice}
                className="btn-primary flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Invoice</span>
              </button>
            )}
            <button
              onClick={generatePDF}
              className="btn-secondary flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Generate PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-heading mb-4">Bill To:</h2>
            <div className="text-body">
              <p className="font-semibold">{orderData.customer_name}</p>
              <p>{orderData.customer_contact}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-heading mb-4">From:</h2>
            <div className="text-body">
              <p>E-Commerce Store</p>
              <p>123 Business Street</p>
              <p>Commerce City, CC 12345</p>
              <p>contact@ecommercestore.com</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items.map(item => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.product_image_url} 
                        alt={item.product_name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span>{item.product_name}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">${item.product_price.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right font-semibold">Total:</td>
                <td className="border border-gray-300 px-4 py-2 text-right font-semibold">${orderData.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-body mb-6 text-lg">Thank you for your business!</p>
          <Link 
            href="/" 
            className="btn-primary text-lg px-8 py-4"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
