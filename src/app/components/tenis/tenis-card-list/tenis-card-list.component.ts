import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TenisService } from '../../../services/tenis.service';
import { MarcaService } from '../../../services/marca.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { Tenis } from '../../../models/tenis.model';
import { Marca } from '../../../models/marca.model';
import { Tamanho } from '../../../models/tamanho.enum';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tenis-card-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './tenis-card-list.component.html',
  styleUrls: ['./tenis-card-list.component.css'],
})
export class TenisCardListComponent implements OnInit {
  // Listas principais
  tenisList: Tenis[] = [];
  tenisFiltrados: Tenis[] = [];
  marcas: Marca[] = [];
  tamanhos = Object.values(Tamanho);

  // Filtros
  filtroMarca: number | null = null;
  filtroPrecoMax: number = 1000;
  filtroTamanho: string = '';
  maxPreco: number = 1000;

  // Loading state
  isLoading = false;

  constructor(
    public tenisService: TenisService,
    private marcaService: MarcaService,
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMarcas();
    this.loadTenis();
  }

  loadMarcas() {
    this.marcaService.findAll().subscribe({
      next: (data) => {
        this.marcas = data;
      },
      error: (error) => {
        console.error('Erro ao carregar marcas:', error);
      },
    });
  }

  loadTenis() {
    this.isLoading = true;
    this.tenisService.findAll().subscribe({
      next: (data) => {
        this.tenisList = data;
        this.tenisFiltrados = data;
        this.maxPreco = Math.max(...data.map((t) => t.preco));
        this.filtroPrecoMax = this.maxPreco;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tênis:', error);
        this.snackBar.open('Erro ao carregar produtos', 'OK', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  aplicarFiltros() {
    this.tenisFiltrados = this.tenisList.filter((tenis) => {
      // Filtro de marca
      if (this.filtroMarca && tenis.marca.id !== this.filtroMarca) {
        return false;
      }

      // Filtro de preço
      if (tenis.preco > this.filtroPrecoMax) {
        return false;
      }

      // Filtro de tamanho
      if (
        this.filtroTamanho &&
        !isNaN(Number(this.filtroTamanho)) && // Verifica se é um número
        tenis.tamanho !== Number(this.filtroTamanho)
      ) {
        return false;
      }

      return true;
    });
  }

  limparFiltros() {
    this.filtroMarca = null;
    this.filtroPrecoMax = this.maxPreco;
    this.filtroTamanho = '';
    this.tenisFiltrados = this.tenisList;
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

  adicionarAoCarrinho(tenis: Tenis) {
    this.carrinhoService.adicionar({
      id: tenis.id,
      nome: tenis.nome,
      preco: tenis.preco,
      quantidade: 1,
    });

    this.snackBar.open('Produto adicionado ao carrinho', 'OK', {
      duration: 3000,
    });
  }

  verDetalhes(tenis: Tenis) {
    // Implementar navegação para detalhes do tênis
  }
}
