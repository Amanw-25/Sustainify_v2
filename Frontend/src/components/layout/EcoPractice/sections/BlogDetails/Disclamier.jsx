import React from "react";
import { FaStar } from "react-icons/fa";


const Disclamier = () => {
  return (
    <>
      <div className="h-[320px] w-[800px] ml-44 bg-white p-4 rounded-lg text-center">
        <p
          style={{
            margin: "0",
            fontSize: "40px",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Read this story from Author— and all the best stories.
          <br />
          <p style={{ fontSize: "18px", color: "grey" }}>
            The author made this story available to Medium members only. Upgrade
            to instantly unlock this story plus other member-only benefits.
          </p>
        </p>
        <ul
          style={{
            margin: "8px 0 0",
            paddingLeft: "140px",
            paddingTop: "30px",
            fontSize: "16px",
            color: "#6B7280",
          }}
        >
          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <FaStar style={{ color: "#F6BE14", marginRight: "8px" }} />
            Access all member-only stories on Medium
          </li>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <FaStar style={{ color: "#F6BE14", marginRight: "8px" }} />
            Dive deeper into the topics that matter to you
          </li>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <FaStar style={{ color: "#F6BE14", marginRight: "8px" }} />
            Get in-depth articles answering thousands of questions
          </li>
          <li style={{ display: "flex", alignItems: "center" }}>
            <FaStar style={{ color: "#F6BE14", marginRight: "8px" }} />
            Achieve your personal and professional goals with unlimited access
            to Medium
          </li>
        </ul>
      </div>
    </>
  );
};

export default Disclamier;
