import { TestBed } from '@angular/core/testing';
import { HeroStackComponent, STACK_SITES } from './hero-stack.component';

describe('HeroStackComponent', () => {
  function create() {
    TestBed.configureTestingModule({ declarations: [HeroStackComponent] });
    const fixture = TestBed.createComponent(HeroStackComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const tabs = () => Array.from(el.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const frames = () => Array.from(el.querySelectorAll<HTMLElement>('.zb-frame'));
    return { fixture, c: fixture.componentInstance, el, tabs, frames };
  }

  it('starts on Kursi.ge, in the agreed order', () => {
    const { tabs, frames } = create();
    expect(STACK_SITES.map(s => s.id)).toEqual(['kursi', 'wisewine', 'arcticblu', 'feelgeorgia']);
    expect(tabs().map(t => t.textContent?.trim())).toEqual(['Kursi.ge', 'WiseWine', 'ArcticBlu Capital', 'Feel Georgia']);
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(frames()[0].classList).toContain('is-active');
  });

  it('switches the page when a tab is clicked', () => {
    const { fixture, tabs, frames, el } = create();
    tabs()[2].click();
    fixture.detectChanges();
    expect(tabs()[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[0].getAttribute('aria-selected')).toBe('false');
    expect(frames()[2].classList).toContain('is-active');
    expect(frames().filter(f => f.classList.contains('is-active'))).toHaveLength(1);
    expect(el.querySelector('.zb-address')?.textContent?.trim()).toBe('arcticblucapital.com');
  });

  it('moves between tabs with the arrow keys, wrapping at the ends', () => {
    const { fixture, tabs } = create();
    tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(tabs()[3].getAttribute('aria-selected')).toBe('true');
    tabs()[3].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[0].getAttribute('tabindex')).toBe('0');
    expect(tabs()[1].getAttribute('tabindex')).toBe('-1');
  });

  it('does not switch on hover', () => {
    const { fixture, tabs, frames } = create();
    tabs()[1].dispatchEvent(new MouseEvent('mouseenter'));
    frames()[3].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
  });
});
