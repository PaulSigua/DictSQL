import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppTheme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private mql = window.matchMedia('(prefers-color-scheme: dark)');
  private _theme$ = new BehaviorSubject<AppTheme>('system');
  theme$ = this._theme$.asObservable();

  constructor() {
    const saved = (localStorage.getItem(STORAGE_KEY) as AppTheme | null) ?? 'system';
    this._theme$.next(saved);
    this.apply(this.effective(saved));

    this.mql.addEventListener('change', this.onSystemChange);
  }

  setTheme(theme: AppTheme) {
    this._theme$.next(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    this.apply(this.effective(theme));
  }

  toggleDarkMode(): void {
    const isDark = document.body.classList.contains('dark');
    this.setTheme(isDark ? 'light' : 'dark');
  }

  get current(): AppTheme {
    return this._theme$.value;
  }

  get effectiveCurrent(): 'light' | 'dark' {
    return this.effective(this.current);
  }

  destroy() {
    this.mql.removeEventListener('change', this.onSystemChange);
  }

  private onSystemChange = () => {
    if (this.current === 'system') {
      this.apply(this.effective('system'));
    }
  };

  private effective(theme: AppTheme): 'light' | 'dark' {
    return theme === 'system' ? (this.mql.matches ? 'dark' : 'light') : theme;
  }

  private apply(effective: 'light' | 'dark') {
    document.body.classList.toggle('dark', effective === 'dark');
    document.body.setAttribute('data-theme', effective);
  }

  setDarkMode(enabled: boolean): void {
    this.setTheme(enabled ? 'dark' : 'light');
  }
  isDarkMode(): boolean {
    return document.body.classList.contains('dark');
  }
}
