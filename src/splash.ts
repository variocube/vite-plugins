import {Plugin} from "vite";
import fs from "node:fs";
import path from "node:path";

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