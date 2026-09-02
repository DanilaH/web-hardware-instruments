# Production deployment

## Production contract

- Canonical origin: `https://hardwareinspect.com`
- Canonical host: apex domain (`hardwareinspect.com`)
- `www.hardwareinspect.com` redirects permanently to the apex host.
- Public page URLs do not use a trailing slash or `.html` suffix.
- Build output is fully static and is served directly by Caddy.
- Production indexing is enabled only for the canonical origin.

## Build

Use the versions pinned by the repository:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test
```

`pnpm build` runs the SEO output guard. Do not deploy if it fails.

The deployable artifact is `dist/`.

## Suggested VPS layout

The committed Caddy example assumes:

```text
/srv/hardwareinspect/current
```

contains the contents of the latest successful `dist/` build. If another directory is used on the VPS, update the `root` in `deploy/Caddyfile.example` before installing the site block.

## Caddy

Use `deploy/Caddyfile.example` as the site-specific configuration. It deliberately rewrites extensionless requests such as `/mouse-tester` to the generated `/mouse-tester.html` file internally. This keeps the browser URL, canonical URL, sitemap URL, and internal links on the same no-trailing-slash form.

Before reloading Caddy:

```bash
caddy validate --config /etc/caddy/Caddyfile
```

Then reload using the service workflow already used on the VPS, for example:

```bash
sudo systemctl reload caddy
```

Caddy manages HTTPS automatically once the domain points to the VPS and ports 80/443 are reachable.

## DNS

Point the apex `hardwareinspect.com` A record to the VPS IPv4 address. Add an AAAA record only if the VPS has working public IPv6. If `www` is configured, point it to the same server so Caddy can redirect it to the canonical apex host.

## Live release gate

After deployment, verify all of the following against the public origin:

```text
https://hardwareinspect.com/
https://hardwareinspect.com/robots.txt
https://hardwareinspect.com/sitemap-index.xml
https://hardwareinspect.com/about
https://hardwareinspect.com/privacy
```

Also verify every released tool route.

Required behavior:

- HTTP redirects to HTTPS.
- `www` redirects to the apex host.
- `/route/` does not become an indexable alternate URL for `/route`.
- `/route.html` is not linked or declared canonical.
- normal routes return 200.
- missing routes return a real 404 status while rendering `404.html`.
- released pages have no `noindex`.
- the 404 page remains `noindex`.
- all canonicals use `https://hardwareinspect.com`.
- sitemap URLs exactly match declared canonicals.
- no `hardware-testing.invalid` value remains in generated output.

Only after this live gate passes should the domain property be verified in Google Search Console and the sitemap submitted.
