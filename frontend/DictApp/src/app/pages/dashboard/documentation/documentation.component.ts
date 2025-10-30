import { Component, inject } from '@angular/core';
import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';
import { DbTab } from '../../../interfaces/db-tab.model';
import { TabManagerService } from '../../../services/tab/tab-manager.service';
import { UiBusService } from '../../../services/ui/ui-bus.service';
import { MetadataResponse } from '../../../interfaces/connection.interface';
import { ConnectionService } from '../../../services/connection/connection.service';
import { MetadataApiResponse } from '../../../interfaces/metadata.interface';

@Component({
  selector: 'app-documentation',
  standalone: false,
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent {
activeTab$: Observable<DbTab | null>;

  public metadata: MetadataApiResponse | null = null;
  public isLoading = true;
  public errorMessage: string | null = null;
  
  private tabService = inject(TabManagerService);
  private connectionService = inject(ConnectionService);

  constructor() {
    this.activeTab$ = this.tabService.tabs$.pipe(
      map(t => t.find(x => x.active) ?? null)
    );
  }

  ngOnInit(): void {
    this.activeTab$.pipe(
      filter((tab): tab is DbTab => tab !== null), 
      switchMap(activeTab => {
        this.isLoading = true;
        this.errorMessage = null;

        if (activeTab.metadata) {
          return of(activeTab.metadata);
        }

        return this.connectionService.getMetadata(activeTab.id).pipe(
          catchError(err => {
            this.errorMessage = err.error?.detail || 'No se pudo cargar la metadata.';
            return of(null);
          })
        );
      })
    ).subscribe(response => {
      this.isLoading = false;
      if (response && response.status === 'success') {
        this.metadata = response;
        this.tabService.updateActiveTabData({ metadata: response });
      } else if (response) {
        this.errorMessage = response.detail || 'Error al procesar la metadata.';
      }
    });
  }

  get tableCount(): number {
    return this.metadata?.tables_count ?? 0;
  }

  get columnCount(): number {
    return this.metadata?.metadata.reduce((acc, table) => acc + table.columns.length, 0) ?? 0;
  }
}