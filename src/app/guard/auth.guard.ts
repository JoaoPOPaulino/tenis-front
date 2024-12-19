import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenExpired()) {
    console.log('Token inválido');
    authService.logout();
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Se a rota começa com /admin, verifica se é administrador
  const usuario = await firstValueFrom(authService.getUsuarioLogado());
  if (state.url.startsWith('/admin')) {
    if (!usuario || usuario.tipoUsuario !== 'ADMINISTRADOR') {
      console.log('Acesso não autorizado: área administrativa');
      router.navigate(['/ecommerce']);
      return false;
    }
  }

  console.log('Token válido');
  return true;
};
