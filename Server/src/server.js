import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import inspectionRoutes from "./routes/inspection.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { db, pool } from "./db/index.js";
import { sql } from "drizzle-orm";

// { Load environment variables}
dotenv.config({ quiet: true });

// { Create the Express Server Instance}
const app = express();
const PORT = process.env.PORT || 5000;

// {Define the Required Middlewares}
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
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

// Start the server & warm up DB connection
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

  // Initial warmup — wake up TiDB Serverless on boot
  try {
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database connection warmed up!");
  } catch (err) {
    console.error("❌ DB warmup failed:", err.message);
  }

  // Keepalive ping every 30 seconds — prevents TiDB Serverless cold starts
  setInterval(async () => {
    try {
      await pool.query("SELECT 1");
    } catch (err) {
      console.error("⚠️ DB keepalive ping failed:", err.message);
    }
  }, 30000);
});