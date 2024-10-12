import { Component, OnInit } from '@angular/core';
import { Tenis } from '../../../models/tenis.model';
import { TenisService } from '../../../services/tenis.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tenis-list',
  standalone: true,
  imports: [
    NgFor,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './tenis-list.component.html',
  styleUrl: './tenis-list.component.css',
})
export class TenisListComponent implements OnInit {
  tableColumns: string[] = [
    'id-column',
    'marca-column',
    'preco-column',
    'estoque-column',
    'modelo-column',
    'descricao-column',
    'acoes-column',
  ];
  tenis: Tenis[] = [];
  totalRegistros = 0;
  pageSize = 2;
  page = 0;
  filter: string = '';
  pdfData: any;

  constructor(private tenisService: TenisService) {}

  ngOnInit(): void {
    this.carregarTenis();
  }

  carregarTenis() {
    if (this.filter) {
      this.tenisService
        .findByNome(this.filter, this.page, this.pageSize)
        .subscribe((data) => {
          this.tenis = data;
        });
    } else {
      this.tenisService.findAll(this.page, this.pageSize).subscribe((data) => {
        this.tenis = data;
      });
    }
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarTenis();
  }

  excluirHardware(tenis: Tenis): void {
    if (confirm(`Deseja realmente excluir o hardware ${tenis.marca}?`)) {
      this.tenisService.delete(tenis).subscribe({
        next: () => {
          console.log('Hardware excluído com sucesso');
          this.carregarTenis();
        },
        error: (err) => {
          console.log('Erro ao excluir hardware: ' + JSON.stringify(err));
        },
      });
    }
  }
}
