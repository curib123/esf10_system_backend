import './configs/env.config.js';

import app from './app.js';
import {
  connectDB,
  disconnectDB,
} from './configs/db.config.js';

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

/* ================= START SERVER ================= */
const startServer = async () => {
  try {
    // 🔌 CONNECT DATABASE FIRST
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `🚀 esf10_system_backend running on port ${PORT} [${NODE_ENV}]`
      );
    });

    /* ================= GRACEFUL SHUTDOWN ================= */
    const shutdown = async (signal) => {
      console.log(`🛑 ${signal} received. Shutting down...`);
      await disconnectDB();
      server.close(() => {
        console.log("✅ Server closed gracefully");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
