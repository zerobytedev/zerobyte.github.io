import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SeoService } from './seo.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  constructor() {
    inject(SeoService).init();
  }
}
