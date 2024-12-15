import { Component, OnInit } from '@angular/core';
import { TenisService } from '../../../services/tenis.service';
import { Tenis } from '../../../models/tenis.model';
import { NgFor, NgStyle, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tenis-card-list',
  standalone: true,
  imports: [
    NgFor,
    NgStyle,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatPaginatorModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CurrencyPipe,
  ],
  templateUrl: './tenis-card-list.component.html',
  styleUrls: ['./tenis-card-list.component.css'],
})
export class TenisCardListComponent implements OnInit {
  tenis: Tenis[] = [];
  totalRecords = 0;
  pageSize = 12;
  page = 0;
  filtro: string = '';

  constructor(
    private tenisService: TenisService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTenis();
    this.loadTotal();
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

  getEstoqueStatus(estoque: number): string {
    if (estoque === 0) return 'Esgotado';
    if (estoque < 10) return 'Últimas unidades';
    return 'Disponível';
  }

  getEstoqueColor(estoque: number): string {
    if (estoque === 0) return '#f44336';
    if (estoque < 10) return '#ff9800';
    return '#4caf50';
  }
}
