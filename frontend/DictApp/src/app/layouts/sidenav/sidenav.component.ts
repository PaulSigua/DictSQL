import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TabManagerService } from '../../services/tab/tab-manager.service';
import { DbTab } from '../../models/db-tab.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  showNewConnectionModal = false;
  hasConnection$!: Observable<boolean>;

  constructor(
    private translate: TranslateService,
    private tabService: TabManagerService
  ) {}

  ngOnInit(): void {
    this.hasConnection$ = this.tabService.tabs$.pipe(
      map((tabs) => tabs.length > 0)
    );
  }

  get hasConnectionSync(): boolean {
    return !!this.tabService.getActiveTab();
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
          { name: 'database.tables', count: 2, isOpen: true, items: [
            { name: 'Users', description: 'user.table.desc' },
            { name: 'Posts', description: 'posts.table.desc' },
          ]},
          { name: 'database.views', count: 1, isOpen: false, items: [
            { name: 'ActiveUsers', description: 'view.activeUsers.desc' },
          ]},
          { name: 'database.storedProcedures', count: 1, isOpen: false, items: [
            { name: 'sp_UpdateUser', description: 'sp.updateUser.desc' },
          ]},
          { name: 'database.functions', count: 1, isOpen: false, items: [
            { name: 'fn_GetUserName', description: 'fn.getUserName.desc' },
          ]},
        ],
      },
    ],
  };
}
