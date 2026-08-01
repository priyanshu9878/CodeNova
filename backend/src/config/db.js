import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Force Node to use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
}

export default main;