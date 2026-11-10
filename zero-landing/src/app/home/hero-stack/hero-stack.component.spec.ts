import { TestBed } from '@angular/core/testing';
import { HeroStackComponent, STACK_SITES } from './hero-stack.component';

describe('HeroStackComponent', () => {
  function create() {
    TestBed.configureTestingModule({ declarations: [HeroStackComponent] });
    const fixture = TestBed.createComponent(HeroStackComponent);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => vi.useRealTimers());

  it('starts with Kursi.ge in front, in the agreed order', () => {
    const { componentInstance: c } = create();
    expect(STACK_SITES.map(s => s.id)).toEqual(['kursi', 'wisewine', 'arcticblu', 'feelgeorgia']);
    expect(c.isFront(0)).toBe(true);
    expect(STACK_SITES.map((_, i) => c.slot(i))).toEqual([0, 1, 2, 3]);
  });

  it('brings a frame to the front and keeps the others in order', () => {
    const fixture = create();
    const c = fixture.componentInstance;
    c.bringToFront(2);
    fixture.detectChanges();
    expect(STACK_SITES.map((_, i) => c.slot(i))).toEqual([1, 2, 0, 3]);
    const frames = (fixture.nativeElement as HTMLElement).querySelectorAll('.zb-frame');
    expect(frames[2].classList).toContain('pos-0');
    expect(frames[2].classList).toContain('is-front');
  });

  it('ignores hover while the previous move is still animating', () => {
    vi.useFakeTimers();
    const { componentInstance: c } = create();
    c.hover(1);
    c.hover(3);
    expect(c.isFront(1)).toBe(true);
    vi.advanceTimersByTime(700);
    c.hover(3);
    expect(c.isFront(3)).toBe(true);
  });

  it('marks the front site chip as pressed', () => {
    const fixture = create();
    fixture.componentInstance.bringToFront(3);
    fixture.detectChanges();
    const pressed = (fixture.nativeElement as HTMLElement).querySelector('.zb-chip[aria-pressed="true"]');
    expect(pressed?.textContent?.trim()).toBe('Feel Georgia');
  });
});
