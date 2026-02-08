import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 10000;

pool.query("SELECT 1")
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  });
