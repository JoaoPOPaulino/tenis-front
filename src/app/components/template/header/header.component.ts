import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { AuthService } from '../../../services/auth.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  usuarioLogado: Usuario | null = null;
  quantidadeItens = 0;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.authService
        .getUsuarioLogado()
        .subscribe((usuario) => (this.usuarioLogado = usuario))
    );

    this.subscriptions.add(
      this.carrinhoService
        .obterQuantidadeTotal()
        .subscribe((quantidade) => (this.quantidadeItens = quantidade))
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onLogout() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.router.navigate(['/login']);
  }

  isAdminUser(): boolean {
    return this.usuarioLogado?.tipoUsuario === 'ADMINISTRADOR';
  }
}
