import { useState } from "react";
import { Link } from "react-router-dom";
import Home_bg from "../../assets/images/Home_bg.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted", formData);
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Side - Image with Opacity */}
      <div className="w-2/5 hidden lg:block mb-20 relative">
        <div className="absolute inset-0 bg-black opacity-40 rounded-md"></div>
        <img
          src={Home_bg}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 py-10 px-5 lg:px-16 flex items-center justify-center">
        <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md p-6 md:p-10 bg-white">
          <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
            Hello! <span className="text-primaryColor">Welcome</span> Back
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <input
                type="email"
                placeholder="Enter Your Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
            
            <div className="mb-5">
              <input
                type="password"
                placeholder="Password Here"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
            
            <div className="mt-7">
              <button
                type="submit"
                className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 min-h-[50px]"
              >
                Login
              </button>
            </div>
            
            <p className="mt-5 text-textColor text-center">
              Don&apos;t have an account?
              <Link 
                to="/register" 
                className="text-primaryColor font-medium ml-1"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;