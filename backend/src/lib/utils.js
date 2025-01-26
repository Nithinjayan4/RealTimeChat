import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "6d",// 6 days
  });

  res.cookie("jwt", token, {
    maxAge: 6 * 24 * 60 * 60 * 1000, // 6 days
    httpOnly: true, // cookie cannot be accessed by client side script
    sameSite: "strict", // cookie cannot be accessed by cross site request
    secure: process.env.NODE_ENV === "development",
  });

  return token;
};
