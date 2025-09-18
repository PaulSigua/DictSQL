import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type AppTheme = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private doc = this.isBrowser ? inject(DOCUMENT) : null;

  private mql: MediaQueryList | null = null;
  private _theme$ = new BehaviorSubject<AppTheme>('system');
  theme$ = this._theme$.asObservable();

  constructor() {
    if (this.isBrowser) {
      this.mql = window.matchMedia?.('(prefers-color-scheme: dark)') ?? null;

      const saved = (localStorage.getItem(STORAGE_KEY) as AppTheme | null) ?? 'system';
      this._theme$.next(saved);

      this.apply(this.effective(saved));

      this.mql?.addEventListener?.('change', this.onSystemChange);
    } else {
      this._theme$.next('system');
    }
  }

  setTheme(theme: AppTheme) {
    this._theme$.next(theme);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, theme);
      this.apply(this.effective(theme));
    }
  }

  toggleDarkMode(): void {
    const isDark = this.isBrowser
      ? this.doc!.body.classList.contains('dark')
      : false;
    this.setTheme(isDark ? 'light' : 'dark');
  }

  get current(): AppTheme {
    return this._theme$.value;
  }

  get effectiveCurrent(): 'light' | 'dark' {
    return this.effective(this.current);
  }

  destroy() {
    this.mql?.removeEventListener?.('change', this.onSystemChange);
  }

  private onSystemChange = () => {
    if (this.current === 'system') {
      this.apply(this.effective('system'));
    }
  };

  private effective(theme: AppTheme): 'light' | 'dark' {
    if (theme === 'system') {
      return this.mql ? (this.mql.matches ? 'dark' : 'light') : 'light';
    }
    return theme;
  }

  private apply(effective: 'light' | 'dark') {
    if (!this.isBrowser || !this.doc) return;
    this.doc.body.classList.toggle('dark', effective === 'dark');
    this.doc.body.setAttribute('data-theme', effective);
  }

  setDarkMode(enabled: boolean): void {
    this.setTheme(enabled ? 'dark' : 'light');
  }
  isDarkMode(): boolean {
    return this.isBrowser ? this.doc!.body.classList.contains('dark') : false;
  }
}
