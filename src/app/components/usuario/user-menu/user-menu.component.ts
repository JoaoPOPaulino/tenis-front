// user-menu.component.ts
import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AlterarSenhaDialogComponent } from '../../dialog/alterar-senha-dialog/alterar-senha-dialog.component';
import { AlterarLoginDialogComponent } from '../../dialog/alterar-login-dialog/alterar-login-dialog.component';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css'],
})
export class UserMenuComponent {
  login = '';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.getUsuarioLogado().subscribe((user) => {
      if (user) {
        this.login = user.nome;
      }
    });
  }

  // Abre o diálogo para alterar senha
  alterarSenha() {
    const dialogRef = this.dialog.open(AlterarSenhaDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Lógica adicional para quando a senha for alterada com sucesso
      }
    });
  }

  // Abre o diálogo para alterar login
  alterarLogin() {
    const dialogRef = this.dialog.open(AlterarLoginDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Lógica adicional para quando o login for alterado com sucesso
      }
    });
  }

  // Redireciona para a página do perfil
  meuPerfil() {
    this.router.navigate(['/perfil']);
  }

  // Realiza o logout do usuário
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Gerenciar telefones
  gerenciarTelefones() {
    this.router.navigate(['/telefones']); // Rota para a página de gerenciamento de telefones
  }

  // Gerenciar endereços
  gerenciarEnderecos() {
    this.router.navigate(['/enderecos']); // Rota para a página de gerenciamento de endereços
  }

  // Gerenciar cartões
  gerenciarCartoes() {
    this.router.navigate(['/cartoes']); // Rota para a página de gerenciamento de cartões
  }
}
