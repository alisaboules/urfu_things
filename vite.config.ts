import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isGithubPages = mode === "github";

  return {
    base: isGithubPages ? "/urfu_things/" : "/",
    plugins: [react()],
  };
});