import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  ngOnInit(): void {
    // Restore saved theme on every navigation (header re-mounts each time)
    const saved = localStorage.getItem('theme');
    this.applyTheme(saved === 'dark');
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
