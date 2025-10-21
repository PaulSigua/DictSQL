import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usa el método que creamos en el servicio
  if (authService.isAuthenticated()) {
    return true; // El usuario está logueado, permite el acceso
  }

  // El usuario NO está logueado, redirige a la página de login
  router.navigate(['/auth/login']);
  return false; 
};