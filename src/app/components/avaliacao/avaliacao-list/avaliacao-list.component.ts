import { Component, OnInit } from '@angular/core';
import { Avaliacao } from '../../../models/avaliacao.model';
import { AvaliacaoService } from '../../../services/avaliacao.service';
import { NgFor } from '@angular/common';
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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-avaliacao-list',
  standalone: true,
  imports: [
    NgFor,
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
    DatePipe,
  ],
  templateUrl: './avaliacao-list.component.html',
  styleUrls: ['./avaliacao-list.component.css'],
})
export class AvaliacaoListComponent implements OnInit {
  avaliacoes: Avaliacao[] = [];
  displayedColumns: string[] = [
    'linha',
    'tenis',
    'usuario',
    'nota',
    'dataAvaliacao',
    'ativa',
    'acao',
  ];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = '';

  constructor(
    private avaliacaoService: AvaliacaoService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAvaliacoes();
    this.loadTotal();
  }

  loadAvaliacoes() {
    this.avaliacaoService
      .findAll(this.page, this.pageSize)
      .subscribe((data) => (this.avaliacoes = data));
  }

  loadTotal() {
    this.avaliacaoService
      .count()
      .subscribe((data) => (this.totalRecords = data));
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAvaliacoes();
  }

  filtrar() {
    if (this.filtro) {
      this.avaliacaoService
        .findByConteudo(this.filtro, this.page, this.pageSize)
        .subscribe((data) => (this.avaliacoes = data));
      this.avaliacaoService
        .countByConteudo(this.filtro)
        .subscribe((data) => (this.totalRecords = data));
    } else {
      this.loadAvaliacoes();
      this.loadTotal();
    }
    this.snackBar.open('Filtro aplicado', 'Ok', { duration: 3000 });
  }

  excluir(avaliacao: Avaliacao) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Deseja realmente excluir esta avaliação?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.avaliacaoService.delete(avaliacao).subscribe({
          next: () => {
            this.avaliacoes = this.avaliacoes.filter(
              (a) => a.id !== avaliacao.id
            );
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
}
