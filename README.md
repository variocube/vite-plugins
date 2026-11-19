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
		const scheme = localStorage.getItem("my-app.colorScheme");
		if (scheme === "light" || scheme === "dark") {
			document.documentElement.setAttribute("data-color-scheme", scheme);
		}
	} catch (e) {
		// storage unavailable: the system preference applies
	}
</script>
```

## rewrite

Rewrites URLs for paths that are not found, even in nested pages (multipage apps).

Vite provides a fallback to `index.html` only for the root page. With this plug-in we
can enable the same behavior for nested pages.