import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    // 4. ENVUELVE TODA LA LÓGICA EN LA VERIFICACIÓN
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');

      if (token && req.url.includes(environment.apiUrl)) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next.handle(cloned);
      }
    }

    // Si estamos en el servidor o no hay token, pasa la petición original
    return next.handle(req);
  }
}