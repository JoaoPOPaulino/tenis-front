import { Component, OnInit } from '@angular/core';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';
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
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-marca-list',
  standalone: true,
  imports: [
    NgFor,
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
export class MarcaListComponent implements OnInit {
  marcas: Marca[] = [];
  displayedColumns: string[] = ['linha', 'id', 'nome', 'nomeImagem', 'acao'];

  totalRecords = 0;
  pageSize = 10;
  page = 0;
  filtro: string = '';

  constructor(
    private marcaService: MarcaService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.marcaService.findAll(this.page, this.pageSize).subscribe((data) => {
      this.marcas = data;
    });

    this.marcaService.count().subscribe((data) => {
      this.totalRecords = data;
    });
  }

  obterNumeroLinha(index: number): number {
    return this.page * this.pageSize + index + 1;
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  buscarMarcas() {
    if (this.filtro) {
      this.marcaService
        .findByNome(this.filtro, this.page, this.pageSize)
        .subscribe((data) => {
          this.marcas = data;
        });
    } else {
      this.marcaService.findAll(this.page, this.pageSize).subscribe((data) => {
        this.marcas = data;
      });
    }
  }

  buscarTodos() {
    if (this.filtro) {
      this.marcaService.countByNome(this.filtro).subscribe((data) => {
        this.totalRecords = data;
      });
    } else {
      this.marcaService.count().subscribe((data) => {
        this.totalRecords = data;
      });
    }
  }

  filtrar() {
    this.buscarMarcas();
    this.buscarTodos();
    this.snackBar.open('O filtro foi aplicado com sucesso!', 'Fechar', {
      duration: 3000,
    });
  }

  excluir(marca: Marca): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message:
          'Deseja realmente excluir esta marca? Não será possível reverter.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.marcaService.delete(marca).subscribe({
          next: () => {
            this.marcas = this.marcas.filter((f) => f.id !== marca.id);
            this.snackBar.open('A marca foi excluída com sucesso!', 'Fechar', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error('Erro ao tentar excluir a marca', err);
            this.snackBar.open('Erro ao tentar excluir a marca', 'Fechar', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  voltar() {
    this.router.navigateByUrl('/marcas');
  }
}
