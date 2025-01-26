import express from "express";
import dotenv from "dotenv";
import authRouters from "./routes/auth.routes.js";
import messageRouters from "./routes/message.routes.js";
import { connectDB } from "./lib/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from "./lib/socket.js";

dotenv.config();


const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouters);
app.use("/api/messages", messageRouters);

server.listen(PORT, () => {
  console.log("server is runing on PORT:" + PORT);
  connectDB();
});
