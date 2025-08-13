import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TabManagerService } from '../../services/tab/tab-manager.service';
import { DbTab } from '../../models/db-tab.model';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { UiBusService } from '../../services/ui/ui-bus.service';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  showNewConnectionModal = false;
  hasConnection$!: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private tabService: TabManagerService,
    private ui: UiBusService
  ) {}

  ngOnInit(): void {
    this.hasConnection$ = this.tabService.tabs$.pipe(
      map((tabs) => tabs.length > 0)
    );

    this.ui.openNewConnection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.openNewConnection());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openNewConnection() {
    this.showNewConnectionModal = true;
  }

  createTab(payload: {
    projectName: string;
    type: 'PostgreSQL' | 'SQLServer' | string;
    connection: any;
  }) {
    const tab: DbTab = {
      id: crypto.randomUUID(),
      title: `${payload.projectName} (${payload.type})`,
      connectionType: payload.type,
      connectionData: payload.connection,
      active: true,
    };
    this.tabService.openTab(tab);
    this.showNewConnectionModal = false;
  }

  database = {
    name: 'DemoDB',
    schemas: [
      {
        name: 'public',
        categories: [
          { name: 'SIDENAV.tables', count: 2, isOpen: true, items: [
            { name: 'Users', description: 'user.table.desc' },
            { name: 'Posts', description: 'posts.table.desc' },
          ]},
          { name: 'SIDENAV.views', count: 1, isOpen: false, items: [
            { name: 'ActiveUsers', description: 'view.activeUsers.desc' },
          ]},
          { name: 'SIDENAV.storedProcedures', count: 1, isOpen: false, items: [
            { name: 'sp_UpdateUser', description: 'sp.updateUser.desc' },
          ]},
          { name: 'SIDENAV.functions', count: 1, isOpen: false, items: [
            { name: 'fn_GetUserName', description: 'fn.getUserName.desc' },
          ]},
        ],
      },
    ],
  };
}
