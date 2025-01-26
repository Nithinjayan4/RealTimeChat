import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body; // get data from request body
  try {
    //hash a password
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    } // check if all fields are filled

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" }); // check password length
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt  token
      generateToken(newUser._id, res); // generate token and set cookie
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      }); // send response
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" }); // check if user exists
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res); // generate token and set cookie

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    }); // send response
  } catch (error) {
    console.log("Error in login controller ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out success" });
  } catch (error) {
    console.log("Error in logout controller ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Please provide profile picture" });
    } // check if profile picture is provided

    const uploadResponse = await cloudinary.uploader.upload(profilePic);// upload image to cloudinary

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


export const checkAuth =async (req,res)=>{

    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in checkAuth controller ", error.message);
        return res.status(500).json({ message: "Server error" });
    }

}
