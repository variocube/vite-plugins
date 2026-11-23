# Vite Plugins

Vite plugins for Variocube applications

## splash

Adds the Variocube splash screen to the `index.html`. Make sure to remove the splash screen with `removeSplash` or `render` from `@variocube/app-ui`.

The splash follows the system preference (`prefers-color-scheme`). To override it, set `data-color-scheme="light"` or
`data-color-scheme="dark"` on the `<html>` element; any other value, or no attribute, leaves the system preference in
effect. The plugin only honours the attribute, the app sets it. Do so in an inline script in the `<head>` of
`index.html`, so it is in place before the splash paints:

```html
<script>
	try {
		const scheme = JSON.parse(localStorage.getItem("variocube-palette-mode"));
		if (scheme === "light" || scheme === "dark") {
			document.documentElement.setAttribute("data-color-scheme", scheme);
		}
	} catch (e) {
		// storage unavailable or value malformed: the system preference applies
	}
</script>
```

`@variocube/app-ui` keeps the user's chosen mode in `localStorage` under `variocube-palette-mode`, JSON-encoded
(`"dark"` with the quotes), hence the `JSON.parse`; an app that stores a plain string drops it. `null` or a missing key
means no choice, so the splash follows the system preference. That matches the app only when its automatic mode is the
system preference. An app with `ignoreSystemMode` or a single-mode branding should also set the attribute to its default
or only mode when nothing usable is stored, and override a stored mode its branding does not offer.

## rewrite

Rewrites URLs for paths that are not found, even in nested pages (multipage apps).

Vite provides a fallback to `index.html` only for the root page. With this plug-in we
can enable the same behavior for nested pages.
