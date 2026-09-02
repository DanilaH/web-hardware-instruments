# Production deployment

## Production contract

- Canonical origin: `https://hardwareinspect.com`
- Canonical host: apex domain (`hardwareinspect.com`)
- `www.hardwareinspect.com` redirects permanently to the apex host.
- Public page URLs do not use a trailing slash or `.html` suffix.
- The Astro build is fully static.
- The production site runs in an isolated `hardwareinspect-web` container.
- The existing VPS Caddy container terminates HTTPS and reverse-proxies to `hardwareinspect-web:8080` over the shared Docker network.
- Production indexing is enabled only for the canonical origin.

## Container build

Production uses `deploy/Dockerfile.production`:

1. Node 24 + pnpm 11 install dependencies.
2. `pnpm build` runs the SEO output guard.
3. `pnpm typecheck` and `pnpm test` must pass.
4. Only the generated `dist/` output is copied into the final nginx container.

The VPS does not need Node or pnpm installed on the host.

## VPS compose

Use:

```bash
docker compose -f deploy/compose.production.yml up -d --build
```

The compose file deliberately publishes no host port. The service only exposes port `8080` inside Docker and joins the existing external network:

```text
vps_booking_network
```

The shared Caddy container must also be attached to that network. The expected upstream name is:

```text
hardwareinspect-web:8080
```

This keeps Hardware Inspect deployment isolated from the booking/listcontrast compose projects: rebuilding or restarting `hardwareinspect-web` does not restart the shared Caddy container or unrelated application containers.

## Static server behavior

`deploy/nginx.production.conf` serves the generated Astro files internally:

- `/mouse-tester` resolves to `/mouse-tester.html` without an external redirect.
- unknown routes return a real `404` status and render the generated `404.html` page.
- `/404` itself also returns `404` rather than becoming a soft-404 page.

Public URL canonicalization remains the responsibility of the external Caddy layer.

## Caddy

Add the site blocks from `deploy/Caddyfile.example` to the existing VPS Caddyfile. They provide:

- `www` → apex redirect;
- `.html` → extensionless redirect;
- trailing-slash → no-trailing-slash redirect;
- immutable caching for fingerprinted `/_astro/*` assets;
- reverse proxy to `hardwareinspect-web:8080`.

For a Dockerized Caddy instance, validate and reload inside the running container rather than installing another Caddy service on the host:

```bash
docker exec vps-caddy-1 caddy validate --config /etc/caddy/Caddyfile
docker exec vps-caddy-1 caddy reload --config /etc/caddy/Caddyfile
```

Do not restart the shared Caddy container merely to add this site when a validated reload is sufficient.

## DNS

Point the apex `hardwareinspect.com` A record to the VPS IPv4 address. `www.hardwareinspect.com` can be a CNAME to `hardwareinspect.com` (or another A record to the same VPS).

Add an AAAA record only if the VPS has working public IPv6.

## Manual update workflow

On the VPS repository checkout:

```bash
git checkout main
git pull --ff-only
docker compose -f deploy/compose.production.yml up -d --build
```

Then verify container health and Caddy connectivity before considering the release complete.

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
- `/route/` redirects to `/route`.
- `/route.html` redirects to `/route`.
- normal routes return `200`.
- missing routes return a real `404` status while rendering `404.html`.
- released pages have no `noindex`.
- the 404 page remains `noindex`.
- all canonicals use `https://hardwareinspect.com`.
- sitemap URLs exactly match declared canonicals.
- no `hardware-testing.invalid` value remains in generated output.

Only after this live gate passes should the domain property be verified in Google Search Console and the sitemap submitted.
