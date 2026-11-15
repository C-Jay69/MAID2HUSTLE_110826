/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

/**
 * Brand icons live in `public/brand` and are served by the Bun server at
 * runtime, so they are registered here instead of in index.html (Bun's HTML
 * bundler tries to resolve `<link href>` values at build time).
 */
function installBrandIcons() {
  const icons: Array<Record<string, string>> = [
    { rel: "icon", href: "/brand/favicon.ico", sizes: "any" },
    { rel: "icon", href: "/brand/favicon.png", type: "image/png", sizes: "64x64" },
    { rel: "apple-touch-icon", href: "/brand/apple-touch-icon.png" },
  ];
  for (const attrs of icons) {
    const link = document.createElement("link");
    for (const [key, value] of Object.entries(attrs)) link.setAttribute(key, value);
    document.head.appendChild(link);
  }
}

installBrandIcons();

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
