require("dotenv").config();

const redis = require("redis");

console.log("REDIS_URL:", process.env.REDIS_URL);

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("connect", () => {
  console.log("✅ Redis connecting...");
});

client.on("ready", () => {
  console.log("✅ Redis is ready");
});

client.on("end", () => {
  console.log("❌ Redis connection closed");
});

client.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

module.exports = client;