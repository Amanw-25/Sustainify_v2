import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate } from 'react-router-dom';

import { BASE_URL } from '../../../../../config';

const CheckoutSuccess = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        
        if (!sessionId) {
          setError('No session ID found');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          return;
        }

        setStatus('verifying');
        
        const response = await fetch(
          `${BASE_URL}/checkout/verify-payment?session_id=${sessionId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Payment verification failed');
        }

        const data = await response.json();
        setOrderDetails(data.booking);
        setStatus('completed');

      } catch (err) {
        setError(err.message || 'Failed to verify payment');
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  if (status === 'processing' || status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-900">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="mt-2 text-gray-600">Thank you for your purchase</p>
        </div>

        {orderDetails && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-medium">{orderDetails._id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-medium">₹{orderDetails.totalAmount}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Shipping Address</p>
                <p className="font-medium">
                  {orderDetails.shippingAddress.street}<br />
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}<br />
                  {orderDetails.shippingAddress.zipCode}, {orderDetails.shippingAddress.country}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="font-medium capitalize">{orderDetails.orderStatus}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 space-x-4 flex justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;