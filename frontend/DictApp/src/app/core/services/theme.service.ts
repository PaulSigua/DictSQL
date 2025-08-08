import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  toggleDarkMode(): void {
    document.body.classList.toggle('dark');
  }

  setDarkMode(enabled: boolean): void {
    document.body.classList.toggle('dark', enabled);
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark');
  }
}