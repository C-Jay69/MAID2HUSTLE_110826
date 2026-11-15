import { serve } from "bun";
import { statSync } from "node:fs";
import path from "node:path";
import index from "./index.html";
import { seedDatabase } from "./server/seed";
import { handleApi } from "./server/api";

seedDatabase();

const PUBLIC_DIR = path.join(import.meta.dir, "..", "public");
const UPLOADS_DIR = path.join(import.meta.dir, "..", "uploads");
const isProduction = process.env.NODE_ENV === "production";

/**
 * Serve files from a directory on disk. Bun has no built-in public folder, so
 * these wildcard routes are registered explicitly ahead of the SPA catch-all.
 * `mount` is the URL prefix (e.g. "/uploads") that maps onto `baseDir`.
 */
function serveFileFrom(mount: string, baseDir: string, cacheControl: string) {
  return (req: Request): Response => {
    const pathname = decodeURIComponent(new URL(req.url).pathname);
    if (!pathname.startsWith(mount + "/")) {
      return new Response("Not found", { status: 404 });
    }
    const filePath = path.resolve(baseDir, `.${pathname.slice(mount.length)}`);

    // Never allow a request to escape the served directory.
    if (!filePath.startsWith(baseDir + path.sep)) {
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
        "Cache-Control": cacheControl,
        "X-Content-Type-Options": "nosniff",
      },
    });
  };
}

const servePublicFile = serveFileFrom("/brand", path.join(PUBLIC_DIR, "brand"), isProduction ? "public, max-age=2592000" : "no-cache");
const serveBackgroundFile = serveFileFrom(
  "/backgrounds",
  path.join(PUBLIC_DIR, "backgrounds"),
  isProduction ? "public, max-age=2592000" : "no-cache",
);
const serveUploadedFile = serveFileFrom("/uploads", UPLOADS_DIR, "private, max-age=3600");

const server = serve({
  port: 3012,
  routes: {
    "/api/*": (req) => handleApi(req),
    "/brand/*": servePublicFile,
    "/backgrounds/*": serveBackgroundFile,
    "/uploads/*": serveUploadedFile,
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
