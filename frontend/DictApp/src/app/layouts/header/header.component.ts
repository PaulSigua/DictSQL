import { Component, HostListener, OnDestroy } from '@angular/core';
import { ThemeService, AppTheme } from '../../core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnDestroy {
  language = 'en';
  isMenuOpen = false;

  // estado de UI
  currentTheme: AppTheme = 'system';
  effective: 'light' | 'dark' = 'light';

  private sub?: Subscription;

  constructor(
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    this.sub = this.themeService.theme$.subscribe((t) => {
      this.currentTheme = t;
      this.effective = this.themeService.effectiveCurrent;
    });
  }

  ngOnInit(): void {
    this.language = this.translate.currentLang || 'en';
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleDark() {
    this.themeService.toggleDarkMode();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  chooseTheme(theme: AppTheme) {
    this.themeService.setTheme(theme);
    this.isMenuOpen = false;
  }

  @HostListener('document:keydown.escape') onEsc() {
    this.isMenuOpen = false;
  }
  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const el = e.target as HTMLElement;
    const within = el.closest('#theme-toggle-btn, #themes-menu');
    if (!within) this.isMenuOpen = false;
  }

  switchLanguage(lang: string) {
    this.language = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  isActive(t: AppTheme) {
    return this.currentTheme === t;
  }
}
