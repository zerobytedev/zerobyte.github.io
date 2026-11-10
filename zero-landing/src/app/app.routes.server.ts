import { RenderMode, ServerRoute } from '@angular/ssr';

// Every page is prerendered to static HTML at build time (GitHub Pages serves plain files).
// Unknown paths fall through to docs/404.html, which is the prerendered not-found page.
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Prerender },
];
