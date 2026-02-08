import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000; 

pool.query("SELECT 1")
  .then(() => {
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ DB error", err);
    process.exit(1);
  });
