/// <reference types="vitest" />

import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
	build: {
		lib: {
			entry: "src/lib/index.ts",
			name: "rehype-highlighter",
			formats: ["cjs", "es"]
		},
		rollupOptions: {
			external: ["unist-util-visit-parents", "parse5", "hast-util-from-parse5", "shiki"]
		}
	},
	plugins: [
		{
			...VitePluginNode({
				adapter: "express",
				appPath: "src/app.ts"
			})[0],
			apply: "serve"
		}
	]
});
