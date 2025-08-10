import { Component, Input } from '@angular/core';
import { DbTab } from '../../models/db-tab.model';
import { Observable } from 'rxjs';
import { TabManagerService } from '../../services/tab/tab-manager.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  tabs$: Observable<DbTab[]>;

  constructor(private tabService: TabManagerService) {
    this.tabs$ = this.tabService.tabs$;
  }

  activate(id: string) {
    this.tabService.setActiveTab(id);
  }

  close(id: string) {
    this.tabService.closeTab(id);
  }
}