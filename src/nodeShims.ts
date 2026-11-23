import {Plugin, Rollup} from 'vite'
import MagicString from 'magic-string'

export function nodeShims(): Plugin {
    return {
        name: '@variocube/vite-plugins:node/shims',
        renderChunk(code, chunk) {
            // console.log('renderChunk', chunk.fileName)
            if (!chunk.fileName.endsWith('.js')
                && !chunk.fileName.endsWith('.mjs')) {
                return
            }

            const pos = code.startsWith("#!")
                ? code.indexOf("\n") + 1
                : 0;

            const s = new MagicString(code)

            s.prependLeft(pos, `
import __path from 'path'
import { fileURLToPath as __fileURLToPath } from 'url'

const __getFilename = () => __fileURLToPath(import.meta.url)
const __getDirname = () => __path.dirname(__getFilename())
const __dirname = __getDirname()
const __filename = __getFilename()
const self = globalThis
`)
            return {
                code: s.toString(),
                // magic-string >= 1 types sourcesContent as (string | null)[], which Rollup's typings do not accept
                map: s.generateMap() as Rollup.ExistingRawSourceMap,
            }
        },
        apply: 'build',
    }
}