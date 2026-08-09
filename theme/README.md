# Grown Men Grow Ghost theme

This is the original, proprietary editorial theme for Grown Men Grow. It is a self-contained Ghost 5.54.1+ theme with no application runtime, tracking script, or remote font dependency.

## Validate

From the repository root:

```sh
node scripts/verify-ghost-theme.mjs
pnpm --dir theme install --frozen-lockfile
pnpm --dir theme test
```

## Package

```sh
pnpm --dir theme zip
```

The package is written to `dist/grown-men-grow.zip`. Upload it only to the private Ghost staging publication until the founder separately approves a public launch.

## Local visual review

From the repository root:

```sh
node scripts/render-theme-preview.mjs
python3 -m http.server 8765 --bind 127.0.0.1
```

Review the generated fixtures under `output/playwright/`. The fixtures use the canonical Start Here and About copy and representative Essay 1 content. They do not replace a final private-Ghost preview.
