import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DbTab } from '../../interfaces/db-tab.model';
import { TabManagerService } from '../../services/tab/tab-manager.service';
import { TranslateService } from '@ngx-translate/core';
import { UiBusService } from '../../services/ui/ui-bus.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  tabs$: Observable<DbTab[]>;
  hasTabs$: Observable<boolean>;
  activeTab$: Observable<DbTab | null>;

  constructor(
    private tabService: TabManagerService,
    private ui: UiBusService
  ) {
    this.tabs$ = this.tabService.tabs$;
    this.hasTabs$ = this.tabs$.pipe(map(t => t.length > 0));
    this.activeTab$ = this.tabs$.pipe(map(t => t.find(x => x.active) ?? null));
  }

  activate(id: string) { 
    this.tabService.setActiveTab(id); 
  }

  close(id: string) {
    this.tabService.closeTab(id);
  }

  trackTab(_: number, t: DbTab) { 
    return t.id; 
  }

  openSidenavNewConnection() {
    this.ui.openNewConnection$.next();
  }
}
