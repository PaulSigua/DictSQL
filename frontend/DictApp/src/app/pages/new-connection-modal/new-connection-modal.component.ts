import { Component, EventEmitter, Output, HostListener, inject } from '@angular/core';
import { ConnectionService } from '../../services/connection/connection.service';
import { TabManagerService } from '../../services/tab/tab-manager.service';
import { BaseConnectionInput } from '../../interfaces/connection.interface';

@Component({
  selector: 'app-new-connection-modal',
  standalone: false,
  templateUrl: './new-connection-modal.component.html',
  styleUrl: './new-connection-modal.component.css'
})
export class NewConnectionModalComponent {
  @Output() close = new EventEmitter<void>();
  
  // 4. Inyectamos los servicios
  private connectionService = inject(ConnectionService);
  private tabService = inject(TabManagerService);

  // 5. Estado de carga y error
  isLoading = false;
  errorMessage: string | null = null;

  // 6. Ajustamos el modelo para que coincida con la interfaz BaseConnectionInput
  model = {
    connection_name: '', // Renombrado de 'projectName'
    type: 'postgresql' as 'postgresql' | 'sqlserver', // Valores en minúscula
    host: 'localhost',
    port: 5432,
    database: '',
    username: '', // Renombrado de 'user'
    password: '',
  };

  @HostListener('document:keydown.escape')
  onEsc() { this.close.emit(); }

  // 7. Lógica de submit() actualizada
  submit() {
    if (!this.model.connection_name?.trim() || !this.model.database?.trim()) {
      this.errorMessage = 'El nombre del proyecto y la base de datos son obligatorios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // 8. Creamos el payload que espera la API
    //    (Omitimos la contraseña si está vacía, por ejemplo)
    const payload: BaseConnectionInput = {
      ...this.model,
      port: Number(this.model.port), // Aseguramos que sea un número
    };
    
    // 9. Llamamos al servicio
    this.connectionService.connectDatabase(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // 10. ¡Éxito! Abrimos la pestaña y cerramos el modal
        this.tabService.openTab({
          id: response.id,
          title: this.model.connection_name,
          active: true,
          dbType: this.model.type, // <-- AÑADE ESTA LÍNEA
          schema: response.schema
        });
        
        this.close.emit();
      },
      error: (err) => {
        // 11. Manejamos el error
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Error al conectar. Revisa los datos.';
      }
    });
  }
}