import React from 'react';

const Error = ({ errorMessage }) => {
  return (
    <div className="flex justify-center items-center w-full ">
      <div className="text-center p-6rounded-lg">
        <h3 className="text-red-600 font-bold text-2xl mb-4">Oops! Something went wrong.</h3>
        <p className="text-gray-700 text-lg">{errorMessage}</p>
      </div>
    </div>
  );
}; 

export default Error;
