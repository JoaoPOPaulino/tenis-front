import { Component, OnInit } from '@angular/core';
import { Tenis } from '../../../models/tenis.model';
import { TenisService } from '../../../services/tenis.service';
import { NgFor, NgIf, NgStyle, CurrencyPipe } from '@angular/common';
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
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-tenis-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
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
    CurrencyPipe,
  ],
  templateUrl: './tenis-list.component.html',
  styleUrls: ['./tenis-list.component.css'],
})
export class TenisListComponent implements OnInit {
  isAdmin: boolean = false;
  isEcommerceRoute: boolean = false;
  tenis: Tenis[] = [];
  displayedColumns: string[] = [
    'linha',
    'id',
    'nome',
    'fornecedor',
    'marca',
    'modelo',
    'tamanho',
    'preco',
    'estoque',
    'acao',
  ];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = '';

  constructor(
    private tenisService: TenisService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.isEcommerceRoute = this.router.url.includes('/ecommerce');
  }

  ngOnInit(): void {
    if (!this.isEcommerceRoute) {
      // Se não estiver na rota de ecommerce, verifica se é admin
      this.authService.getUsuarioLogado().subscribe((usuario) => {
        this.isAdmin = usuario?.tipoUsuario === 'ADMINISTRADOR';
      });
    }
    this.loadTenis();
    this.loadTotal();
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  loadTenis() {
    this.tenisService
      .findAll(this.page, this.pageSize)
      .subscribe((data) => (this.tenis = data));
  }

  loadTotal() {
    this.tenisService.count().subscribe((data) => (this.totalRecords = data));
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTenis();
  }

  filtrar() {
    if (this.filtro) {
      this.tenisService
        .findByNome(this.filtro, this.page, this.pageSize)
        .subscribe((data) => (this.tenis = data));
      this.tenisService
        .countByNome(this.filtro)
        .subscribe((data) => (this.totalRecords = data));
    } else {
      this.loadTenis();
      this.loadTotal();
    }
    this.snackBar.open('Filtro aplicado', 'Ok', { duration: 3000 });
  }

  excluir(tenis: Tenis) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Deseja realmente excluir este tênis?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tenisService.delete(tenis).subscribe({
          next: () => {
            this.tenis = this.tenis.filter((t) => t.id !== tenis.id);
            this.snackBar.open('Tênis excluído com sucesso!', 'Ok', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Erro ao excluir tênis', error);
            this.snackBar.open('Erro ao excluir tênis', 'Ok', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}
