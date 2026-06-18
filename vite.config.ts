import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

type PuzzleManifest = {
  count: number;
};

const randomPuzzleApi = (): Plugin => {
  return {
    name: "random-puzzle-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const url = new URL(req.url, "http://localhost");
        if (url.pathname !== "/api/puzzles/random") {
          next();
          return;
        }

        const manifestPath = fileURLToPath(
          new URL("./public/puzzles/manifest.json", import.meta.url),
        );
        const manifest = JSON.parse(
          readFileSync(manifestPath, "utf-8"),
        ) as PuzzleManifest;
        const id = String(Math.floor(Math.random() * manifest.count)).padStart(
          4,
          "0",
        );
        const puzzlePath = fileURLToPath(
          new URL(`./public/puzzles/${id}.json`, import.meta.url),
        );

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(readFileSync(puzzlePath, "utf-8"));
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), randomPuzzleApi()],
  resolve: {
    tsconfigPaths: true,
  },
});
