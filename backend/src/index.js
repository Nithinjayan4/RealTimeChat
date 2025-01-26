import express from "express";
import dotenv from "dotenv";
import authRouters from "./routes/auth.routes.js";
import messageRouters from "./routes/message.routes.js";
import { connectDB } from "./lib/database.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouters);
app.use("/api/message", messageRouters);

app.listen(PORT, () => {
  console.log("server is runing on PORT:" + PORT);
  connectDB();
});
