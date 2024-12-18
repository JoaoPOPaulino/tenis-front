import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primeiro verifica se está autenticado
  if (authService.isTokenExpired()) {
    console.log('Token inválido');
    authService.logout();
    router.navigate(['/admin/login']);
    return false;
  }

  // Depois verifica se é admin
  if (!authService.isAdmin()) {
    console.log('Usuário não é administrador');
    router.navigate(['/produtos']);
    return false;
  }

  console.log('Usuário é administrador');
  return true;
};
