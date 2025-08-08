import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private themeService: ThemeService) {}

  toggleDark() {
    this.themeService.toggleDarkMode();
  }
}
