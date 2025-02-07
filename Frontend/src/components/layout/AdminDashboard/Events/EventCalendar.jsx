import React from "react";
import Sidebar from "../Global/Sidebar";

const EventCalendar = () => {
  return (
    <div>
      <Sidebar />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800">Event Calendar</h1>
      </div>
    </div>
  );
};

export default EventCalendar;
