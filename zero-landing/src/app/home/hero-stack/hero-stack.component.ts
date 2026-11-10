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

/** How long a bring-to-front animation runs; hover is ignored meanwhile so frames sliding under a still pointer don't chain. */
const SETTLE_MS = 650;

/**
 * Hero stack of live client sites.
 * Desktop: overlapping browser frames; hovering a frame (or its chip) brings it to the front, the rest keep their order.
 * Phone: a native scroll-snap row with the next frame peeking in, plus position dots.
 * Clicking the front frame scrolls to that project's card in #work.
 */
@Component({
  selector: 'app-hero-stack',
  templateUrl: './hero-stack.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HeroStackComponent implements AfterViewInit, OnDestroy {
  readonly sites = STACK_SITES;
  /** order[0] is the front frame; values are indexes into `sites`. */
  readonly order = signal<number[]>(STACK_SITES.map((_, i) => i));
  /** Which frame is in view in the phone swipe row. */
  readonly visible = signal(0);

  private readonly frames = viewChildren<ElementRef<HTMLElement>>('frame');
  private readonly row = viewChildren<ElementRef<HTMLElement>>('row');
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private settledAt = 0;
  private observer?: IntersectionObserver;

  slot(i: number): number {
    return this.order().indexOf(i);
  }

  isFront(i: number): boolean {
    return this.order()[0] === i;
  }

  /** Pointer-driven: ignored while the previous move is still animating. */
  hover(i: number): void {
    if (Date.now() < this.settledAt) return;
    this.bringToFront(i);
  }

  /** Click, keyboard focus or chip: always acts. */
  bringToFront(i: number): void {
    if (this.isFront(i)) return;
    this.order.update(o => [i, ...o.filter(x => x !== i)]);
    this.settledAt = Date.now() + SETTLE_MS;
  }

  /** Click on a frame: a back frame comes forward; the front one (or any frame on a phone) opens its Work card. */
  frameClick(event: MouseEvent, i: number): void {
    event.preventDefault();
    if (!this.isPhone() && !this.isFront(i)) {
      this.bringToFront(i);
      return;
    }
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
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;
    const row = this.row()[0]?.nativeElement;
    if (!row) return;
    this.zone.runOutsideAngular(() => {
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
  }

  private isPhone(): boolean {
    return this.isBrowser && window.matchMedia('(max-width: 991.98px)').matches;
  }

  private reducedMotion(): boolean {
    return this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
