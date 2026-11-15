import tailwind from "bun-plugin-tailwind";
import { cp, rm } from "node:fs/promises";
import path from "node:path";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

const entrypoints = [...new Bun.Glob("src/**/*.html").scanSync()];

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [tailwind],
  minify: true,
  target: "browser",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}

// Brand + background assets are served from the site root at runtime, so copy
// them next to the built HTML for static deployments of `dist/`.
for (const dir of ["brand", "backgrounds"]) {
  await cp(path.join(process.cwd(), "public", dir), path.join(outdir, dir), { recursive: true });
  console.log(` ${path.join("dist", dir)}  (copied from public/${dir})`);
}
