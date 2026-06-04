import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const isGithubPages = process.env.VITE_TARGET === "github";

  return {
    base: isGithubPages ? "/urfu_things/" : "/",
    plugins: [react()],
  };
});