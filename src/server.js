import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Simple health route (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("PixelForge Nexus Backend Running 🚀");
});

// Start server even if DB fails (important for demo)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Optional DB check (non-blocking)
pool.query("SELECT 1")
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.log("⚠️ DB not connected (demo mode)", err.message));
