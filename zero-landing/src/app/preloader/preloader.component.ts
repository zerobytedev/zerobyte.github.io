import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css']
})
export class PreloaderComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
      preloader.style.transition = 'opacity 0.3s ease';
      preloader.style.opacity = '0';
      setTimeout(() => { preloader.style.display = 'none'; }, 300);
    }, 100);
  }
}
