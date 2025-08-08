import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'DictApp';

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Idioms supported
    translate.addLangs(['en', 'es']);
    // Idioms default
    translate.setFallbackLang('en');

    // Only set the language if we are in the browser
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
      // fallback si estás en SSR
      translate.use('en');
    }
  }
}
