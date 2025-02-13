import React, { useState } from "react";
import { Dialog, Switch, IconButton } from "@mui/material";
import { FaCheck, FaTimes,FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../../config";

const SubscriptionPlans = () => {
  const [open, setOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubscribe = async () => {
    try {
      if (!token) {
        toast.error("Please login to subscribe");
        return;
      }

      setLoading(true);
      const planType = isYearly ? "yearly" : "monthly";

      const response = await fetch(`${BASE_URL}/subscription/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Subscription failed");

      if (!data.sessionUrl) throw new Error("No checkout URL received");

      window.location.href = data.sessionUrl;
    } catch (error) {
      toast.error(error.message || "Failed to process subscription");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Access all member-only stories on Medium",
    "Dive deeper into the topics that matter to you",
    "Get in-depth articles answering thousands of questions",
    "Achieve your personal and professional goals",
  ];

  return (
    <div className="w-full max-w-lg mx-auto p-6 text-center">
      {/* Features Section */}
      <h1 className="text-4xl font-bold text-black mb-4">Read the best stories from industry leaders.</h1>
      <ul className="mt-4 space-y-3 text-gray-600 text-lg text-left mx-auto max-w-md">
        {features.map((text, index) => (
          <li key={index} className="flex items-center">
            <FaStar className="text-yellow-500 mr-2" />
            {text}
          </li>
        ))}
      </ul>

      {/* Upgrade Button */}
      <button
        onClick={() => setOpen(true)}
        className="mt-6 bg-[#F8CC15] text-black px-6 py-3 rounded-full text-lg font-semibold 
                 transition duration-300 hover:bg-[#e3b913] disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upgrade"}
      </button>

      {/* Subscription Modal */}
      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
        <div className="p-6 sm:p-8 max-w-md mx-auto bg-white rounded-lg text-center relative">
          {/* Close Button */}
          <IconButton
            onClick={() => !loading && setOpen(false)}
            className="absolute top--10 right-0" 
            disabled={loading}
            size="small"
          >
            <FaTimes className="text-gray-500 hover:text-gray-700" />
          </IconButton>


          {/* Modal Title */}
          <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className={!isYearly ? "font-bold" : "text-gray-500"}>Monthly</span>
            <Switch
              checked={isYearly}
              onChange={() => !loading && setIsYearly(!isYearly)}
              disabled={loading}
              color="primary"
            />
            <span className={isYearly ? "font-bold" : "text-gray-500"}>Yearly</span>
          </div>

          {/* Subscription Plan Card */}
          <div className="bg-white p-6 rounded-lg ">
            <h3 className="text-xl font-bold mb-2">
              {isYearly ? "Yearly Plan" : "Monthly Plan"}
            </h3>
            <p className="text-3xl font-bold mb-4">
              ₹{isYearly ? "499" : "49"}
              <span className="text-base font-normal text-gray-500">
                /{isYearly ? "year" : "month"}
              </span>
            </p>

            {/* Feature List */}
            <ul className="mt-4 space-y-2 text-gray-700 text-sm text-left mx-auto max-w-xs">
              {features.map((text, index) => (
                <li key={index} className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  {text}
                </li>
              ))}
            </ul>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              className="mt-6 w-full bg-[#F8CC15] text-black px-6 py-3 rounded-full text-lg font-semibold 
                       transition duration-300 hover:bg-[#e3b913] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
