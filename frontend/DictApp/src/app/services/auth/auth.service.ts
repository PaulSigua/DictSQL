import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UserCreate } from '../../interfaces/user-create.interface';
import { Observable } from 'rxjs';
import { UserResponse } from '../../interfaces/user-response.interface';
import { environment } from '../../../environments/environment.development';
import { UserLogin } from '../../interfaces/user-login.interface';
import { TokenResponse } from '../../interfaces/user-token.interface';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = `${environment.apiUrl}/auth/register`;
  private loginUrl = `${environment.apiUrl}/auth/login`;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /**
   * Realiza la petición POST al endpoint de registro de FastAPI.
   * @param userData - Datos de registro (username, email, password).
   */
  register(userData: UserCreate): Observable<UserResponse> {
    // HttpClient se encargará de serializar el objeto userData a JSON
    return this.http.post<UserResponse>(this.registerUrl, userData);
  }

  /**
   * Realiza la petición POST al endpoint de login de FastAPI.
   * @param userData - Datos de login (email, password).
   */
  login(userData: UserLogin): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.loginUrl, userData);
  }

  /**
   * Guarda el token generado por la API en el Local Storage al realizarse el login de FastAPI.
   * @param token - Valor de autenticación cifrado.
   */
  saveToken(token: string): void {
    // Solo se ejecuta en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', token);
    }
  }

  /**
   * Revisa si hay un token de acceso en el localStorage.
   */
  public isAuthenticated(): boolean {
    // Solo se ejecuta en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
      return !!token; 
    }
    // Si estamos en el servidor, nunca estamos autenticados
    return false;
  }

  /**
   * Elimina el token y redirige al login.
   */
  public logout(): void {
    // Solo se ejecuta en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      this.router.navigate(['/auth/login']);
    }
  }
}
