import express from "express";
import dotenv from "dotenv";
import authRouters from "./routes/auth.routes.js";
import { connectDB } from "./lib/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use("/api/auth", authRouters);

app.listen(PORT, () => {
  console.log("server is runing on PORT:" + PORT);
  connectDB();
});
