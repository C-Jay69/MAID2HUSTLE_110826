import { serve } from "bun";
import { statSync } from "node:fs";
import path from "node:path";
import index from "./index.html";
import { seedDatabase } from "./server/seed";
import { handleApi } from "./server/api";

seedDatabase();

const PUBLIC_DIR = path.join(import.meta.dir, "..", "public");
const isProduction = process.env.NODE_ENV === "production";

/**
 * Serve files that live in the project's `public/` folder (brand assets,
 * background images, etc). Bun has no built-in public folder, so these
 * wildcard routes are registered explicitly ahead of the SPA catch-all.
 */
function servePublicFile(req: Request): Response {
  const pathname = decodeURIComponent(new URL(req.url).pathname);
  const filePath = path.resolve(PUBLIC_DIR, `.${pathname}`);

  // Never allow a request to escape the public directory.
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    if (!statSync(filePath).isFile()) {
      return new Response("Not found", { status: 404 });
    }
  } catch {
    return new Response("Not found", { status: 404 });
  }

  return new Response(Bun.file(filePath), {
    headers: {
      "Cache-Control": isProduction ? "public, max-age=2592000" : "no-cache",
    },
  });
}

const server = serve({
  port: 3012,
  routes: {
    "/api/*": (req) => handleApi(req),
    "/brand/*": servePublicFile,
    "/backgrounds/*": servePublicFile,
    "/*": index,
  },

  development: !isProduction && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 MAID 2 HUSTLE server running at ${server.url}`);
