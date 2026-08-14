import { serve } from "bun";
import index from "./index.html";
import { seedDatabase } from "./server/seed";
import { handleApi } from "./server/api";

seedDatabase();

const server = serve({
  port: 3012,
  routes: {
    "/api/*": (req) => handleApi(req),
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 MAID 2 HUSTLE server running at ${server.url}`);
