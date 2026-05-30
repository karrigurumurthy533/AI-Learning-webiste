import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// 🔹 Generate Token
// @desc   Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc   Register new user
// @route  POST /api/v1/auth/register
// @access Public
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //Check User Exist Or Not
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }


    //create User
    const user = await User.create({
      username,
      email,
      password
    });

    //Generate Token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt
        },
        
      },
      token,
      message: "User Registered SuccessFully"

    });

  } catch (error) {
    next(error); // 👉 important
  }
};

// @desc   Login user
// @route  POST /api/v1/auth/login
// @access Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
        statusCode: 400
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid Email or Password",
        statusCode: 401
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Respond with user info (exclude password)
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        
      },
      token,
      message: "Login Successful"
    });

  } catch (error) {
    next(error);
  }
};


// @desc   Get logged in user profile
// @route  GET /api/v1/auth/profile
// @access Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      message:"get login user profile"
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update user profile
// @route  PUT /api/v1/auth/profile
// @access Private
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        updatedAt: user.updatedAt
      },
      message: "Profile Updated SuccessFully"
    });
  }

  catch (error) {
    next(error);
  }
};

// @desc   Change user password
// @route  PUT /api/v1/auth/change-password
// @access Private
export const changePassword = async (req, res, next) => {
  try {
   

    const { oldPassword, newPassword } = req.body;

    if(!oldPassword||!newPassword){
            return res.status(400).json({ 
              success:false,
              message: "Old password incorrect" ,
              statusCode:400
            });

    }
     const user = await User.findById(req.user.id).select("+password");
      const isMatch = await user.matchPassword(oldPassword);

     if(!isMatch){
      return res.status(401).json({ 
              success:false,
              message: "Old password incorrect" ,
              statusCode:401
            });

     }
    
    user.password =newPassword; 
    await user.save();

    res.status(200).json({
      success:true,
       message: "Password changed successfully" 
      });

  } catch (error) {
    next(error);
  }
};