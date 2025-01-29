import bcrypt from "bcrypt";
import{ User }from "../models/index.js";
import jwt from "jsonwebtoken";

const genrateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  const { name, email, password, profilePhoto } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePhoto,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: "Internal Server Error",
    });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = genrateToken(user);
    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
      },
    });

  }
  catch(error){
    res.status(500).json({
      message: error.message,
      error: "Internal Server Error",
    });
  }
}