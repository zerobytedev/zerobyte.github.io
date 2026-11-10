// Finishes the static GitHub Pages output in ../docs after `ng build`.
import { copyFileSync, rmSync, readFileSync, writeFileSync, readdirSync, existsSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs');

// GitHub Pages serves 404.html (with a real 404 status) for unknown paths: use the prerendered not-found page.
copyFileSync(join(docs, 'not-found', 'index.html'), join(docs, '404.html'));

// GitHub Pages 301-redirects /contact to /contact/ when a folder exists, but serves contact.html at /contact
// with a 200. Flatten every prerendered route folder to <route>.html so URLs match the canonical tags.
for (const entry of readdirSync(docs, { withFileTypes: true })) {
  const index = join(docs, entry.name, 'index.html');
  if (!entry.isDirectory() || entry.name === 'assets' || !existsSync(index)) continue;
  renameSync(index, join(docs, `${entry.name}.html`));
  rmSync(join(docs, entry.name), { recursive: true });
}

// Build artefacts Pages does not need.
for (const f of ['prerendered-routes.json', 'index.csr.html']) rmSync(join(docs, f), { force: true });

// Keep the sitemap's lastmod current.
const sitemap = join(docs, 'sitemap.xml');
const today = new Date().toISOString().slice(0, 10);
writeFileSync(sitemap, readFileSync(sitemap, 'utf8').replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`));

console.log('postbuild: 404.html, sitemap lastmod', today);
