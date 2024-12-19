import { Component, OnInit, OnDestroy } from '@angular/core';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';
import { NgFor, NgIf } from '@angular/common';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-marca-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatSidenavModule,
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
  templateUrl: './marca-list.component.html',
  styleUrls: ['./marca-list.component.css'],
})
export class MarcaListComponent implements OnInit, OnDestroy {
  marcas: Marca[] = [];
  displayedColumns: string[] = ['linha', 'id', 'nome', 'nomeImagem', 'acao'];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = '';

  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private marcaService: MarcaService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService
      .getUsuarioLogado()
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario) => {
        if (usuario?.tipoUsuario !== 'ADMINISTRADOR') {
          this.router.navigate(['/home']);
        } else {
          this.loadData();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    this.marcaService
      .findAll(this.page, this.pageSize)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (data) => {
          this.marcas = data;
          this.loadTotal();
        },
        error: (error) => {
          console.error('Erro ao carregar marcas', error);
          this.error = 'Erro ao carregar marcas. Tente novamente.';
          this.snackBar.open('Erro ao carregar marcas', 'OK', {
            duration: 3000,
          });
        },
      });
  }

  loadTotal(): void {
    this.marcaService
      .count()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (total) => (this.totalRecords = total),
        error: (error) => console.error('Erro ao carregar total', error),
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

    const serviceCall = this.filtro
      ? this.marcaService.findByNome(this.filtro, this.page, this.pageSize)
      : this.marcaService.findAll(this.page, this.pageSize);

    serviceCall
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (data) => {
          this.marcas = data;
          this.updateTotal();
        },
        error: (error) => {
          console.error('Erro ao filtrar marcas', error);
          this.snackBar.open('Erro ao filtrar marcas', 'OK', {
            duration: 3000,
          });
        },
      });
  }

  private updateTotal(): void {
    const countCall = this.filtro
      ? this.marcaService.countByNome(this.filtro)
      : this.marcaService.count();

    countCall
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => (this.totalRecords = total));
  }

  excluir(marca: Marca): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message:
          'Deseja realmente excluir esta marca? Não será possível reverter.',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.isLoading = true;
          this.marcaService
            .delete(marca)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
              next: () => {
                this.marcas = this.marcas.filter((m) => m.id !== marca.id);
                this.totalRecords--;
                this.snackBar.open('Marca excluída com sucesso!', 'OK', {
                  duration: 3000,
                });

                // Recarregar se for a última marca da página
                if (this.marcas.length === 0 && this.page > 0) {
                  this.page--;
                  this.loadData();
                }
              },
              error: (error) => {
                console.error('Erro ao excluir marca', error);
                this.snackBar.open('Erro ao excluir marca', 'OK', {
                  duration: 3000,
                });
              },
            });
        }
      });
  }
}
