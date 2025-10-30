import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TabManagerService } from '../../services/tab/tab-manager.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { UiBusService } from '../../services/ui/ui-bus.service';
import { DbTab } from '../../interfaces/db-tab.model';
import { TableMetadata } from '../../interfaces/metadata.interface';

interface SidenavCategory {
  name: string;
  icon: string;
  iconColor: string;
  count: number;
  isOpen: boolean;
  items: { name: string; description?: string }[];
}

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

  activeDatabaseName: string | null = null;
  categories: SidenavCategory[] = [];

  private tabService = inject(TabManagerService);
  private ui = inject(UiBusService);
  // private translate = inject(TranslateService);

  ngOnInit(): void {
    this.hasConnection$ = this.tabService.tabs$.pipe(
      map((tabs) => tabs.length > 0)
    );

    this.ui.openNewConnection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.openNewConnection());

    this.tabService.tabs$.pipe(
      map(tabs => tabs.find(t => t.active) ?? null),
      takeUntil(this.destroy$)
    ).subscribe(activeTab => {
      this.updateSidenavData(activeTab);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openNewConnection() {
    this.showNewConnectionModal = true;
  }
  
  private updateSidenavData(tab: DbTab | null) {
    if (!tab) {
      this.activeDatabaseName = null;
      this.categories = [];
      return;
    }

    this.activeDatabaseName = tab.title;
    const metadata = tab.metadata;
    const schema = tab.schema;
    
    const tables: TableMetadata[] = metadata?.metadata ?? [];
  

    this.categories = [
      {
        name: 'SIDENAV.tables', // Para la traducción
        icon: 'Table',
        iconColor: 'text-blue-600',
        count: tables.length,
        isOpen: true,
        items: tables.map(t => ({
          name: t.table,
          description: t.description || 'Sin descripción'
        }))
      },
      // Datos de ejemplo para lo que tu backend aún no provee
      {
        name: 'SIDENAV.views',
        icon: 'View',
        iconColor: 'text-green-600',
        count: 0,
        isOpen: false,
        items: []
      },
      {
        name: 'SIDENAV.storedProcedures',
        icon: 'DatabaseZap',
        iconColor: 'text-purple-600',
        count: 0,
        isOpen: false,
        items: []
      },
      {
        name: 'SIDENAV.functions',
        icon: 'FunctionSquare',
        iconColor: 'text-orange-600',
        count: 0,
        isOpen: false,
        items: []
      }
    ];
  }
}