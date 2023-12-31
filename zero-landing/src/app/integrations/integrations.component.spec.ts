import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationsComponent } from './integrations.component';

describe('IntegrationsComponent', () => {
  let component: IntegrationsComponent;
  let fixture: ComponentFixture<IntegrationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntegrationsComponent]
    });
    fixture = TestBed.createComponent(IntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
