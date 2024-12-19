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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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
    MatProgressSpinnerModule,
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
  pageSizeOptions = [5, 10, 25, 50];
  page = 0;
  filtro: string = '';

  isLoading = false;
  errorMessage: string | null = null;

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
    this.checkAdminStatus();
    this.loadData();
  }

  private checkAdminStatus(): void {
    if (!this.isEcommerceRoute) {
      this.authService.getUsuarioLogado().subscribe({
        next: (usuario) => {
          this.isAdmin = usuario?.tipoUsuario === 'ADMINISTRADOR';
        },
        error: (error) => {
          console.error('Erro ao verificar status do usuário:', error);
          this.snackBar.open('Erro ao verificar permissões do usuário', 'OK', {
            duration: 3000,
          });
        },
      });
    }
  }

  private loadData(): void {
    this.loadTenis();
    this.loadTotal();
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  loadTenis(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.tenisService
      .findAll(this.page, this.pageSize)
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar tênis:', error);
          this.errorMessage =
            'Erro ao carregar a lista de tênis. Tente novamente mais tarde.';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data) => {
        this.tenis = data;
      });
  }

  loadTotal(): void {
    this.tenisService
      .count()
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar total:', error);
          return of(0);
        })
      )
      .subscribe((total) => {
        this.totalRecords = total;
      });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  filtrar(): void {
    this.page = 0; // Reset para primeira página ao filtrar
    this.isLoading = true;
    this.errorMessage = null;

    if (this.filtro.trim()) {
      const filtroRequest = this.tenisService
        .findByNome(this.filtro, this.page, this.pageSize)
        .pipe(
          catchError((error) => {
            console.error('Erro ao filtrar tênis:', error);
            this.errorMessage =
              'Erro ao aplicar filtro. Tente novamente mais tarde.';
            return of([]);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        );

      const countRequest = this.tenisService.countByNome(this.filtro).pipe(
        catchError((error) => {
          console.error('Erro ao contar registros filtrados:', error);
          return of(0);
        })
      );

      filtroRequest.subscribe((data) => {
        this.tenis = data;
      });

      countRequest.subscribe((total) => {
        this.totalRecords = total;
      });
    } else {
      this.loadData();
    }
  }

  excluir(tenis: Tenis): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Deseja realmente excluir este tênis?',
      },
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.tenisService
          .delete(tenis)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe({
            next: () => {
              this.tenis = this.tenis.filter((t) => t.id !== tenis.id);
              this.totalRecords--;
              this.snackBar.open('Tênis excluído com sucesso!', 'OK', {
                duration: 3000,
              });

              // Recarrega os dados se estiver na última página e ela ficar vazia
              if (this.tenis.length === 0 && this.page > 0) {
                this.page--;
                this.loadData();
              }
            },
            error: (error) => {
              console.error('Erro ao excluir tênis:', error);
              this.snackBar.open(
                'Erro ao excluir tênis. Tente novamente mais tarde.',
                'OK',
                {
                  duration: 3000,
                }
              );
            },
          });
      }
    });
  }

  limparFiltro(): void {
    if (this.filtro) {
      this.filtro = '';
      this.page = 0;
      this.loadData();
    }
  }
}
