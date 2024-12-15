import { Component, OnInit } from '@angular/core';
import { Tenis } from '../../../models/tenis.model';
import { TenisService } from '../../../services/tenis.service';
import { CommonModule, NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tenis-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule],
  templateUrl: './tenis-list.component.html'
})
export class TenisListComponent implements OnInit {
  tenis: Tenis[] = [];
  displayedColumns: string[] = ['id', 'nome', 'marca', 'fornecedor', 'acoes'];

  constructor(private tenisService: TenisService) {}

  ngOnInit(): void {
    this.loadTenis();
  }

  loadTenis(): void {
    this.tenisService.findAll().subscribe({
      next: (data: Tenis[]) => {
        this.tenis = data;
      },
      error: (error) => {
        console.error('Erro ao carregar tênis:', error);
      }
    });
  }
}