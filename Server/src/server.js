import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import inspectionRoutes from "./routes/inspection.routes.js";
import reportRoutes from "./routes/report.routes.js";

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

app.use(express.json({ limit: "50mb" })); // Increased limit for Base64 image uploads
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser()); // Allows server to read cookies

// {Define the routes}
app.use("/api/auth", authRoutes); // Authentication (Register, Login, Refresh, Logout)  
app.use("/api/inspections", inspectionRoutes); // Inspection Lifecycle & Forms
app.use("/api/reports", reportRoutes);         // Final Certificates

// {Demo api call}
app.get('/api/health', (req, res) => {
  res.json({ message: 'Seed Inspection API is running!', status: 'OK' });
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});