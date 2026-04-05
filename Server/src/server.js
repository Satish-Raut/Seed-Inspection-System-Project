import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

// { Load environment variables}
dotenv.config({ quiet: true });

// { Create the Express Server Instance}
const app = express();
const PORT = process.env.PORT || 5000;

// {Define the Required Middlewares}
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json()); // Parses incoming JSON requests
app.use(cookieParser()); // Allows server to read cookies

// {Define the routes}
app.use("/api/auth", authRoutes); // Authentication (Register, Login, Refresh, Logout)  

// {Demo api call}
app.get('/api/health', (req, res) => {
  res.json({ message: 'Seed Inspection API is running!', status: 'OK' });
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});