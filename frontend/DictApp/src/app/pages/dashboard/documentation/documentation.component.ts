import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DbTab } from '../../../models/db-tab.model';
import { TabManagerService } from '../../../services/tab/tab-manager.service';
import { UiBusService } from '../../../services/ui/ui-bus.service';

@Component({
  selector: 'app-documentation',
  standalone: false,
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent {
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
}
