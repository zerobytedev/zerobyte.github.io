import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IntegrationsComponent } from './integrations.component';

describe('IntegrationsComponent', () => {
  it('lists the cloud providers we deploy to', () => {
    TestBed.configureTestingModule({
      declarations: [IntegrationsComponent],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA],
    });
    const fixture = TestBed.createComponent(IntegrationsComponent);
    fixture.detectChanges();
    const names = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.zb-tech-card h3'))
      .map(h => h.textContent?.trim());
    expect(names).toEqual(expect.arrayContaining(['AWS', 'Google Cloud', 'DigitalOcean', 'MongoDB Atlas']));
  });
});
