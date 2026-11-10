import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, PLATFORM_ID, DOCUMENT, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {

  private routerSub?: Subscription;
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly zone = inject(NgZone);
  private removeScroll?: () => void;

  ngOnInit(): void {
    // Prerendering runs on the server: no localStorage, no Bootstrap JS.
    if (!this.isBrowser) return;

    this.applyTheme(this.readTheme() === 'dark');

    // Sticky header: the template styles nav.sticky-header.affix once the page has scrolled.
    this.zone.runOutsideAngular(() => {
      const onScroll = () => {
        this.doc.querySelector('nav.sticky-header')?.classList.toggle('affix', window.scrollY >= 2);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      this.removeScroll = () => window.removeEventListener('scroll', onScroll);
    });

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      const offcanvasEl = this.doc.getElementById('offcanvasWithBackdrop');
      if (offcanvasEl) {
        const bsOffcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(offcanvasEl);
        bsOffcanvas?.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.removeScroll?.();
  }

  toggleTheme(): void {
    const current = this.doc.documentElement.getAttribute('data-bs-theme');
    this.applyTheme(current !== 'dark');
  }

  private readTheme(): string | null {
    try { return localStorage.getItem('theme'); } catch { return null; }
  }

  private applyTheme(dark: boolean): void {
    this.doc.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch { /* storage blocked */ }
  }
}
