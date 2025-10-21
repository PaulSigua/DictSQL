import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const publicGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Revisa si el usuario está autenticado
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']); 
    return false;
  }

  return true; 
};