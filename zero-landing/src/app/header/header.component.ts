import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    this.applyTheme(saved === 'dark');

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      const offcanvasEl = document.getElementById('offcanvasWithBackdrop');
      if (offcanvasEl) {
        const bsOffcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(offcanvasEl);
        bsOffcanvas?.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleTheme(): void {
    const current = document.querySelector(':root')?.getAttribute('data-bs-theme');
    this.applyTheme(current !== 'dark');
  }

  private applyTheme(dark: boolean): void {
    const root = document.querySelector(':root');
    if (!root) return;
    root.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
}
