import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'DictApp';

  constructor(
    private translate: TranslateService,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Idiomas soportados
    translate.addLangs(['en', 'es']);
    translate.setFallbackLang('en');

    // Solo configuramos idioma si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const storedLang = localStorage.getItem('lang');
      const browserLang = translate.getBrowserLang();

      const langToUse =
        storedLang && ['en', 'es'].includes(storedLang)
          ? storedLang
          : browserLang && ['en', 'es'].includes(browserLang)
          ? browserLang
          : 'en';

      translate.use(langToUse);
    } else {
      translate.use('en');
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.themeService.setTheme(this.themeService.current);
    }
  }
}
