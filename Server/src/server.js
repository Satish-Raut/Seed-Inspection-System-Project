import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// { Load environment variables}
dotenv.config({ quiet: true });

// { Create the Express Server Instance}
const app = express();
const PORT = process.env.PORT || 5000;

// {Define the Required Middlewares}
app.use(express.json()); // Parses incoming JSON requests
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Allows frontend to talk to backend

// {Define the routes}
app.get('/api/health', (req, res) => {
  res.json({ message: 'Seed Inspection API is running!', status: 'OK' });
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});