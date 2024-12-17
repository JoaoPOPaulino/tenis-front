import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produto } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css'],
})
export class ProdutoListComponent implements OnInit {
  produtos: Produto[] = [];
  displayedColumns = ['id', 'nome', 'preco', 'estoque', 'fornecedor', 'acoes'];
  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro = '';

  constructor(
    private produtoService: ProdutoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProdutos();
    this.loadTotal();
  }

  loadProdutos(): void {
    this.produtoService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.produtos = data;
    });
  }

  loadTotal(): void {
    this.produtoService.count().subscribe((total) => {
      this.totalRecords = total;
    });
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProdutos();
  }

  filtrar(): void {
    if (this.filtro) {
      this.produtoService
        .findByNome(this.filtro, this.page, this.pageSize)
        .subscribe((data) => {
          this.produtos = data;
        });
    } else {
      this.loadProdutos();
    }
  }

  excluir(produto: Produto): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Deseja realmente excluir este produto?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.produtoService.delete(produto).subscribe({
          next: () => {
            this.produtos = this.produtos.filter((p) => p.id !== produto.id);
            this.snackBar.open('Produto excluído com sucesso', 'OK', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Erro ao excluir produto', error);
            this.snackBar.open('Erro ao excluir produto', 'OK', {
              duration: 3000,
            });
          },
        });
      }
    });
  }
}
