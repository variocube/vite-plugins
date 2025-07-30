import {ViteDevServer, Plugin, ResolvedConfig} from "vite";
import * as fs from "node:fs";
import * as path from "node:path";

export function splash(): Plugin {
    return {
        name: "@variocube/vite-plugins:splash",
        transformIndexHtml: {
            order: "pre",

            async handler(html: string) {
                const styles = fs.readFileSync(path.resolve(import.meta.dirname, "..", "splash", "splash.css"), "utf-8");
                const splash = fs.readFileSync(path.resolve(import.meta.dirname, "..", "splash", "splash.html"), "utf-8");

                return html
                    // Add styles to the end of the head
                    .replace("</head>", `<style>${styles}</style></head>`)
                    // Add the splash screen to the end of the body
                    .replace("</body>", `${splash}</body>`);
            },
        },
    };
}

interface RewriteOptions {
    [prefix: string]: string;
}

export function rewrite(options: RewriteOptions): Plugin {
    let config: ResolvedConfig;
    return {
        name: "@variocube/vite-plugins:rewrite",
        configResolved(resolvedConfig: ResolvedConfig) {
            config = resolvedConfig;
        },
        configureServer(serve: ViteDevServer) {
            serve.middlewares.use((req, res, next) => {
                // Remove any query string and fragment
                const url = req.url?.replace(/[?#].*$/, "") || "";

                // URL-decode the path
                const pathname = decodeURIComponent(url);

                const filePath = path.join(config.root, pathname);

                // if the requested file does not exist on disk,
                // it can be subject to our rewrites
                if (!fs.existsSync(filePath)) {
                    for (const [prefix, path] of Object.entries(options)) {
                        if (pathname.startsWith(prefix)) {
                            req.url = path;
                            break;
                        }
                    }
                }

                next();
            });
        },
    }
}