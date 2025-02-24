import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FaTimesCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-lg font-semibold 
                   transition duration-300 hover:bg-gray-300 w-full"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelled;