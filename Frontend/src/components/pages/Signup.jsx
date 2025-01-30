import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Home_bg from "../../assets/images/Home_bg.jpg";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import uploadImageToCloudinary from "../../utils/uploadCloudinary.js"; 

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  });

  const navigate = useNavigate();


  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    setImgLoading(true); 
    try {
      const file = e.target.files[0];
      if (!file) return;

      const data = await uploadImageToCloudinary(file); 

      setPreviewURL(data.url);
      setSelectedFile(data.url);
      setFormData({ ...formData, photo: data.url });
    } catch (error) {
      console.error("Image Upload Error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImgLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); 

      if (!res.ok) {
        throw new Error(data.message || "Signup failed!");
      }

      toast.success(data.message || "Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-3/5 py-6 px-4 sm:px-6 lg:px-16 flex items-center justify-center">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-[570px] mx-auto rounded-lg shadow-md p-6 md:p-10 bg-white">
          <h3 className="text-headingColor text-xl md:text-[22px] leading-9 font-bold mb-6 md:mb-10 text-center">
            Create An <span className="text-primaryColor">Account</span>
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pr-4 py-2 md:py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base md:text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />

              <input
                type="email"
                placeholder="Enter Your Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pr-4 py-2 md:py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base md:text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />

              <input
                type="password"
                placeholder="Create Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pr-4 py-2 md:py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base md:text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
            {/* <div className="my-4 md:my-5 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="w-full sm:w-1/2 pr-0 sm:pr-2">
                <label className="text-headingColor text-sm md:text-[16px] leading-7">
                  Role:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full pr-4 py-2 md:py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-base md:text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select Your Role</option>
                    <option value="customer">Customer</option>
                    <option value="installer">Installer</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              </div>
            </div> */}

            <div className="my-4 md:mb-5 flex flex-col sm:flex-row items-center gap-3">
              <figure className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                <img
                  src={formData.photo || ""}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </figure>
              <div className="relative w-full sm:w-[130px] h-[40px] md:h-[50px]">
                <label
                  htmlFor="customFile"
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center px-2 py-1 md:px-[0.75rem] md:py-[0.375rem] text-xs md:text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                >
                  Upload Photo
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    accept=".jpg, .png"
                    onChange={handleFileChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 md:mt-7">
              <button
                type="submit"
                className="w-full bg-primaryColor text-white text-base md:text-[18px] leading-[30px] rounded-lg px-4 py-2 md:py-3 min-h-[45px] md:min-h-[50px] hover:bg-opacity-90 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>

            <p className="mt-4 md:mt-5 text-textColor text-center text-sm md:text-base">
              Already have an account?
              <Link to="/login" className="text-primaryColor font-medium ml-1">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="w-2/5 hidden lg:block mb-20 relative">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img src={Home_bg} alt="Login" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Signup;
