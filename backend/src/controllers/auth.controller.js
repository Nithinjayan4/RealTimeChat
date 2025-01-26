import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body; // get data from request body
  try {
    //hash a password
    if(!fullName || !email || !password){
        return res.status(400).json({ message: "Please fill all fields" });
    }
      
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
      res.status(201).json({ _id: newUser._id,
        fullName: newUser.fullName,
         email: newUser.email ,
         profilePic: newUser.profilePic,});// send response
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = (req, res) => {
  res.send("Login route");
};

export const logout = (req, res) => {
  res.send("Logout route");
};
