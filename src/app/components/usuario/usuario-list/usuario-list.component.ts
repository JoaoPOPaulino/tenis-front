import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { NgFor, NgStyle } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    NgFor,
    NgStyle,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    RouterModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  displayedColumns: string[] = [
    'linha',
    'id',
    'nome',
    'email',
    'tipoUsuario',
    'telefones',
    'enderecos',
    'cartoes',
    'acao',
  ];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadTotal();
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  loadUsuarios() {
    this.usuarioService
      .findAll(this.page, this.pageSize)
      .subscribe((data) => (this.usuarios = data));
  }

  loadTotal() {
    this.usuarioService.count().subscribe((data) => (this.totalRecords = data));
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsuarios();
  }

  filtrar() {
    if (this.filtro) {
      this.usuarioService
        .findByNome(this.filtro, this.page, this.pageSize)
        .subscribe((data) => (this.usuarios = data));
      this.usuarioService
        .countByNome(this.filtro)
        .subscribe((data) => (this.totalRecords = data));
    } else {
      this.loadUsuarios();
      this.loadTotal();
    }
    this.snackBar.open('Filtro aplicado', 'Ok', { duration: 3000 });
  }

  excluir(usuario: Usuario) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Deseja realmente excluir este usuário?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarioService.delete(usuario).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
            this.snackBar.open('Usuário excluído com sucesso!', 'Ok', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Erro ao excluir usuário', error);
            this.snackBar.open('Erro ao excluir usuário', 'Ok', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}
