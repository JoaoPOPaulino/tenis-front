import { NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { Tenis } from '../../../models/tenis.model';
import { TenisService } from '../../../services/tenis.service';

type Card = {
  titulo: string;
  marca: string;
  descricao: string;
  preco: number;
  imageUrl: string;
};

@Component({
  selector: 'app-tenis-card-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgFor],
  templateUrl: './tenis-card-list.component.html',
})
export class TenisCardListComponent implements OnInit {
  tenis: Tenis[] = [];
  cards = signal<TenisCard[]>([]);

  constructor(
    private tenisService: TenisService,
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarTenis();
  }

  carregarTenis() {
    this.tenisService.findAll(0, 10).subscribe((data) => {
      this.tenis = data;
      this.carregarCards();
    });
  }

  carregarCards() {
    const cards: TenisCard[] = [];
    this.tenis.forEach((tenis) => {
      cards.push({
        idTenis: tenis.id,
        titulo: tenis.nome,
        marca: tenis.marca.nome,
        modelo: tenis.modelo,
        tamanho: tenis.tamanho.descricao,
        preco: tenis.preco,
        imageUrl: this.tenisService.getUrlImage(tenis.nomeImagem),
      });
    });
    this.cards.set(cards);
  }

  adicionarAoCarrinho(card: TenisCard) {
    this.showSnackbarTopPosition('Tênis adicionado ao carrinho');
    this.carrinhoService.adicionar({
      id: card.idTenis,
      nome: card.titulo,
      preco: card.preco,
      quantidade: 1,
    });
  }
}
