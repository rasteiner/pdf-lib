import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
    ],
    build: {
        lib: {
            entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
            name: "pdf-lib",
            fileName: `index`,
            formats: ["es"],
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
