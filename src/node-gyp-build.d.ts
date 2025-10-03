// Simple type declaration for "node-gyp-build"
// that allows us to call its resolve function.
declare module "node-gyp-build" {
    export function resolve(dir: string): string;
}
