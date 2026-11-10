import {
  AfterViewInit, ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, NgZone, OnDestroy, PLATFORM_ID,
  inject, signal, viewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface StackSite {
  /** Matches the Work card id: `work-<id>`. */
  id: string;
  host: string;
  name: string;
  /** Base name of assets/img/work/<img>.webp and <img>-600.webp. */
  img: string;
}

export const STACK_SITES: StackSite[] = [
  { id: 'kursi', host: 'kursi.ge', name: 'Kursi.ge', img: 'kursi' },
  { id: 'wisewine', host: 'wisewine.ge', name: 'WiseWine', img: 'wisewine' },
  { id: 'arcticblu', host: 'arcticblucapital.com', name: 'ArcticBlu Capital', img: 'arcticblu' },
  { id: 'feelgeorgia', host: 'feelgeorgia.ge', name: 'Feel Georgia', img: 'feelgeorgia' },
];

/**
 * Hero window of live client sites.
 * Desktop: one browser window whose tabs switch the page (click or keyboard only; 200 ms crossfade).
 * Phone: a native scroll-snap swipe row with the next site peeking in, plus position dots.
 * Clicking the page scrolls to that project's card in #work.
 */
@Component({
  selector: 'app-hero-stack',
  templateUrl: './hero-stack.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HeroStackComponent implements AfterViewInit, OnDestroy {
  readonly sites = STACK_SITES;
  /** Selected tab on desktop. */
  readonly active = signal(0);
  /** Which frame is in view in the phone swipe row. */
  readonly visible = signal(0);
  /** Sliding tab indicator, measured in the browser; null until measured (the selected tab paints itself). */
  readonly indicator = signal<{ x: number; w: number } | null>(null);

  private readonly frames = viewChildren<ElementRef<HTMLElement>>('frame');
  private readonly row = viewChildren<ElementRef<HTMLElement>>('row');
  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;

  select(i: number): void {
    this.active.set(i);
    this.measure();
  }

  /** WAI-ARIA tabs: arrows move and select (wrapping), Home/End jump to the ends. */
  onTabKey(event: KeyboardEvent, i: number): void {
    const n = this.sites.length;
    const next = ({ ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 } as Record<string, number>)[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.select(next);
    this.tabs()[next]?.nativeElement.focus();
  }

  /** Clicking the page opens its Work card further down. */
  frameClick(event: MouseEvent, i: number): void {
    event.preventDefault();
    const card = this.doc.getElementById(`work-${this.sites[i].id}`);
    if (!card) return;
    card.scrollIntoView({ behavior: this.reducedMotion() ? 'auto' : 'smooth', block: 'center' });
    card.focus({ preventScroll: true });
  }

  /** Phone dots: scroll the row to that frame. */
  goTo(i: number): void {
    const el = this.frames()[i]?.nativeElement;
    const row = this.row()[0]?.nativeElement;
    if (!el || !row) return;
    row.scrollTo({ left: el.offsetLeft - row.offsetLeft, behavior: this.reducedMotion() ? 'auto' : 'smooth' });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.measure();
    this.zone.runOutsideAngular(() => {
      const tablist = this.tabs()[0]?.nativeElement.parentElement;
      if (tablist && typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.measure());
        this.resizeObserver.observe(tablist);
      }
      const row = this.row()[0]?.nativeElement;
      if (!row || typeof IntersectionObserver === 'undefined') return;
      this.observer = new IntersectionObserver(entries => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            const i = this.frames().findIndex(f => f.nativeElement === e.target);
            if (i >= 0) this.visible.set(i);
          }
        }
      }, { root: row, threshold: [0.6] });
      this.frames().forEach(f => this.observer!.observe(f.nativeElement));
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
  }

  private measure(): void {
    if (!this.isBrowser) return;
    const tab = this.tabs()[this.active()]?.nativeElement;
    if (!tab || !tab.offsetWidth) return;
    this.indicator.set({ x: tab.offsetLeft, w: tab.offsetWidth });
  }

  private reducedMotion(): boolean {
    return this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
