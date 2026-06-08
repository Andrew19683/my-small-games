import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/my-small-games/",
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        mastermind: resolve(import.meta.dirname, "games/mastermind/index.html"),
      },
    },
  },
});
