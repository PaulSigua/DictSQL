import { Component, inject } from '@angular/core';
import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';
import { DbTab } from '../../../interfaces/db-tab.model';
import { TabManagerService } from '../../../services/tab/tab-manager.service';
import { UiBusService } from '../../../services/ui/ui-bus.service';
import { MetadataResponse } from '../../../interfaces/connection.interface';
import { ConnectionService } from '../../../services/connection/connection.service';

@Component({
  selector: 'app-documentation',
  standalone: false,
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css'
})
export class DocumentationComponent {
activeTab$: Observable<DbTab | null>;

  // 4. Propiedades para los datos, carga y error
  metadata: MetadataResponse | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  
  // 5. Inyectamos los servicios
  private tabService = inject(TabManagerService);
  private connectionService = inject(ConnectionService);
  // private ui = inject(UiBusService); // (No se está usando, se puede quitar si no se usa)

  constructor() {
    this.activeTab$ = this.tabService.tabs$.pipe(
      map(t => t.find(x => x.active) ?? null)
    );
  }

  // 6. ngOnInit para cargar los datos
  ngOnInit(): void {
    this.activeTab$.pipe(
      // Nos aseguramos de que el tab no sea nulo
      filter((tab): tab is DbTab => tab !== null), 
      // Usamos switchMap para cambiar a la llamada de la API
      switchMap(activeTab => {
        this.isLoading = true;
        this.errorMessage = null;
        // 7. Llamamos al servicio con el ID de la pestaña activa
        return this.connectionService.getMetadata(activeTab.id).pipe(
          // Manejamos errores de la API
          catchError(err => {
            this.errorMessage = err.error?.detail || 'No se pudo cargar la metadata.';
            return of(null); // Devolvemos null para que el stream continúe
          })
        );
      })
    ).subscribe(response => {
      this.isLoading = false;
      if (response) {
        this.metadata = response;
      }
    });
  }
}