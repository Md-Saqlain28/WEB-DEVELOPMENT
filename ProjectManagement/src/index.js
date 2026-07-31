import dns from "node:dns";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

// Force Node to use Google and Cloudflare DNS servers for resolving MongoDB SRV records
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
