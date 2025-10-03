import type { Plugin } from 'vite'
import {dirname} from "path";

const PLUGIN_ID = '@variocube/vite-plugins:nodeNative'

export function nodeNative(modules: string[]): Plugin {
    return {
        name: PLUGIN_ID,
        apply: 'build',
        enforce: 'pre',
        resolveId(source, importer) {
            // console.log("nodeNative", source, importer)
            this.debug(`resolveId: ${source} importer=${importer}`);
            if (source == "node-gyp-build") {
                const module = modules.find(m => importer?.includes(m));
                if (module) {
                    return `${PLUGIN_ID}:${module}`;
                }
            }
            return null;
        },
        async load(id) {
            this.debug(`load: ${id}`);
            if (id.startsWith(PLUGIN_ID)) {
                const module = id.replace(PLUGIN_ID, '').replace(":", "");
                this.info(`Generating loader for ${module}`);

                const moduleDir = dirname(import.meta.resolve(`${module}/package.json`, this.environment.config.root).substring(7));
                this.info(`Using module dir ${moduleDir}`);

                const nodeGypBuild = await import("node-gyp-build");
                const bindings = nodeGypBuild.resolve(moduleDir);
                this.info(`Using bindings ${bindings}`);

                return createCode(bindings);
            }
        }
    }
}

function createCode(bindings: string) {
    return `
import {createRequire} from "node:module";
import binding from "${bindings}";
export default function(dir) {
    const require = createRequire(import.meta.url);
    return require(binding.startsWith("file://") ? binding.substring(7) : binding);
}
`;
}
