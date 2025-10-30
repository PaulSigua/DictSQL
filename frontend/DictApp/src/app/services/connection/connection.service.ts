import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseConnectionInput, ConnectionTestResponse, MetadataResponse } from '../../interfaces/connection.interface';
import { catchError, Observable, throwError } from 'rxjs';
import { MetadataApiResponse } from '../../interfaces/metadata.interface';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private connectionsUrl = `${environment.apiUrl}/connections`;

  constructor(private http: HttpClient) { }

  /**
   * Endpoint para probar y guardar una nueva conexión a la base de datos.
   * @param connectionData - Datos del formulario de conexión
   */
  connectDatabase(connectionData: BaseConnectionInput): Observable<ConnectionTestResponse> {
    return this.http.post<ConnectionTestResponse>(
      `${this.connectionsUrl}/connect`, 
      connectionData
    ).pipe(
      catchError(this.handleError) // Manejo de errores
    );
  }

  /**
   * Endpoint para obtener la metadata enriquecida de una conexión existente.
   * @param connectionId - El ID de la conexión
   */
  getMetadata(connectionId: string): Observable<MetadataApiResponse> { 
    return this.http.get<MetadataApiResponse>( // <-- Actualiza el tipo aquí
      `${this.connectionsUrl}/metadata/${connectionId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejador de errores simple.
   * Devuelve el error para que el componente que lo llamó lo maneje.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error en ConnectionService:', error.message);
    // Devuelve el error completo para que el componente pueda leer `error.error.detail`
    return throwError(() => error); 
  }


}
