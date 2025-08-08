import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  language = 'en'; // Default language

  constructor(
    private themeService: ThemeService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // sincronice the current language with the TranslateService
    this.language = this.translate.currentLang || 'en';
  }

  toggleDark() {
    this.themeService.toggleDarkMode();
  }

  switchLanguage(lang: string) {
    this.language = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
