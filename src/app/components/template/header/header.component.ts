import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatBadge } from '@angular/material/badge';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../../services/sidebar.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatBadge,
    MatButton,
    MatIconButton,
    RouterModule,
    NgIf,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  usuarioLogado: Usuario | null = null;
  private subscription = new Subscription();

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService
        .getUsuarioLogado()
        .subscribe((usuario) => (this.usuarioLogado = usuario))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clickMenu(): void {
    this.sidebarService.toggle();
  }

  deslogar(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
