import { Component, Input } from '@angular/core';
import { TabManagerService } from '../../services/tab/tab-manager.service';
import { DbTab } from '../../models/db-tab.model';

@Component({
  selector: 'app-db-tab',
  standalone: false,
  templateUrl: './db-tab.component.html',
  styleUrl: './db-tab.component.css',
})
export class DbTabComponent {
  @Input() tab!: DbTab;
}

