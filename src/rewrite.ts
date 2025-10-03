import {Plugin, ResolvedConfig, ViteDevServer} from "vite";
import path from "node:path";
import fs from "node:fs";

export interface RewriteOptions {
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