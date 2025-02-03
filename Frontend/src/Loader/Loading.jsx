import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-full mt-10 flex justify-center">
      <ClipLoader
        color="#000000"
        loading={true}
        size={70}
        width={8}
        speedMultiplier={1.5}
      />
    </div>
  );
};

export default Loading;
