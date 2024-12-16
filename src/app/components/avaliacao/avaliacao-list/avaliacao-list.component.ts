import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  finalize,
} from 'rxjs/operators';

import { Avaliacao } from '../../../models/avaliacao.model';
import { AvaliacaoService } from '../../../services/avaliacao.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';

import { NgFor, NgStyle, DatePipe, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-avaliacao-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgStyle,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    RouterModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressBarModule,
    DatePipe,
  ],
  templateUrl: './avaliacao-list.component.html',
  styleUrls: ['./avaliacao-list.component.css'],
})
export class AvaliacaoListComponent implements OnInit, OnDestroy {
  avaliacoes: Avaliacao[] = [];
  displayedColumns: string[] = [
    'linha',
    'id',
    'tenis',
    'usuario',
    'nota',
    'dataAvaliacao',
    'ativa',
    'acao',
  ];

  totalRecords = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  page = 0;
  filtro: string = '';
  isLoading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private avaliacaoService: AvaliacaoService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.setupSearch();
  }

  ngOnInit(): void {
    this.loadAvaliacoes();
    this.loadTotal();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 0;
        this.filtrar();
      });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  loadAvaliacoes(): void {
    this.isLoading = true;
    this.error = null;

    this.avaliacaoService
      .findAll(this.page, this.pageSize)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (data) => {
          this.avaliacoes = data;
          this.error = null;
        },
        error: (error) => {
          console.error('Erro ao carregar avaliações', error);
          this.error = 'Erro ao carregar avaliações. Tente novamente.';
          this.snackBar.open('Erro ao carregar avaliações', 'Ok', {
            duration: 3000,
          });
        },
      });
  }

  loadTotal(): void {
    this.avaliacaoService
      .count()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (total) => (this.totalRecords = total),
        error: (error) => {
          console.error('Erro ao carregar total', error);
          this.snackBar.open('Erro ao carregar total de registros', 'Ok', {
            duration: 3000,
          });
        },
      });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAvaliacoes();
  }

  filtrar(): void {
    this.isLoading = true;
    this.error = null;

    if (this.filtro) {
      this.avaliacaoService
        .findByConteudo(this.filtro, this.page, this.pageSize)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isLoading = false))
        )
        .subscribe({
          next: (data) => {
            this.avaliacoes = data;
            this.avaliacaoService
              .countByConteudo(this.filtro)
              .subscribe((total) => (this.totalRecords = total));
            this.snackBar.open('Filtro aplicado', 'Ok', { duration: 3000 });
          },
          error: (error) => {
            console.error('Erro ao filtrar avaliações', error);
            this.error = 'Erro ao filtrar avaliações. Tente novamente.';
            this.snackBar.open('Erro ao aplicar filtro', 'Ok', {
              duration: 3000,
            });
          },
        });
    } else {
      this.loadAvaliacoes();
      this.loadTotal();
    }
  }

  excluir(avaliacao: Avaliacao): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: 'Deseja realmente excluir esta avaliação?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.isLoading = true;
          this.avaliacaoService
            .delete(avaliacao.id)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
              next: () => {
                this.avaliacoes = this.avaliacoes.filter(
                  (a) => a.id !== avaliacao.id
                );
                this.totalRecords--;
                this.snackBar.open('Avaliação excluída com sucesso!', 'Ok', {
                  duration: 3000,
                });
              },
              error: (error) => {
                console.error('Erro ao excluir avaliação', error);
                this.snackBar.open('Erro ao excluir avaliação', 'Ok', {
                  duration: 3000,
                });
              },
            });
        }
      });
  }

  novaAvaliacao(): void {
    this.router.navigate(['/avaliacoes/new']);
  }

  editarAvaliacao(id: number): void {
    this.router.navigate([`/avaliacoes/edit/${id}`]);
  }
}
