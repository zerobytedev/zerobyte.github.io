import { Injectable, DOCUMENT, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SeoData {
  title: string;
  description: string;
  /** Path without leading slash; '' for the home page. */
  path: string;
  noindex?: boolean;
}

const ORIGIN = 'https://zerobyte.ge';
const OG_IMAGE = `${ORIGIN}/assets/img/og-zerobyte.jpg`;
const OG_IMAGE_ALT = 'ZEROBYTE — software development company in Tbilisi, Georgia';

/** Sets title, description, canonical and Open Graph tags from each route's `data.seo`. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly doc = inject(DOCUMENT);

  init(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      let r = this.route;
      while (r.firstChild) r = r.firstChild;
      const seo = r.snapshot.data['seo'] as SeoData | undefined;
      if (seo) this.apply(seo);
    });
  }

  private apply(seo: SeoData): void {
    const url = seo.path ? `${ORIGIN}/${seo.path}` : `${ORIGIN}/`;
    this.title.setTitle(seo.title);
    const tags: Array<[string, string, 'name' | 'property']> = [
      ['description', seo.description, 'name'],
      ['robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large', 'name'],
      ['og:type', 'website', 'property'],
      ['og:site_name', 'ZEROBYTE', 'property'],
      ['og:title', seo.title, 'property'],
      ['og:description', seo.description, 'property'],
      ['og:url', url, 'property'],
      ['og:image', OG_IMAGE, 'property'],
      ['og:image:secure_url', OG_IMAGE, 'property'],
      ['og:image:type', 'image/jpeg', 'property'],
      ['og:image:width', '1200', 'property'],
      ['og:image:height', '630', 'property'],
      ['og:image:alt', OG_IMAGE_ALT, 'property'],
      ['twitter:card', 'summary_large_image', 'name'],
      ['twitter:title', seo.title, 'name'],
      ['twitter:description', seo.description, 'name'],
      ['twitter:image', OG_IMAGE, 'name'],
      ['twitter:image:alt', OG_IMAGE_ALT, 'name'],
    ];
    for (const [key, content, attr] of tags) {
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }

    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
