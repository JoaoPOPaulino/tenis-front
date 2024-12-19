import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
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
import { AuthService } from '../../../services/auth.service';

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
export class ProdutoListComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  produtos: Produto[] = [];
  displayedColumns: string[] = [
    'id',
    'nome',
    'preco',
    'estoque',
    'fornecedor',
    'acoes',
  ];
  totalRecords: number = 0;
  pageSize: number = 10;
  page: number = 0;
  filtro: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private produtoService: ProdutoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService
      .getUsuarioLogado()
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario) => {
        if (usuario?.tipoUsuario !== 'ADMINISTRADOR') {
          this.router.navigate(['/home']);
        } else {
          this.isAdmin = true;
          this.loadProdutos();
          this.loadTotal();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
