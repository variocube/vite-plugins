# Vite Plugins

Vite plugins for Variocube applications

## splash

Adds the Variocube splash screen to the `index.html`. Make sure to remove the splash screen with `removeSplash` or `render` from `@variocube/app-ui`.

## rewrite

Rewrites URLs for paths that are not found, even in nested pages (multipage apps).

Vite provides a fallback to `index.html` only for the root page. With this plug-in we
can enable the same behavior for nested pages.