import { NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, MatCardFooter, MatCardModule, MatCardTitle } from '@angular/material/card';
import { Tenis } from '../../../models/tenis.model';
import { TenisService } from '../../../services/tenis.service';

type Card = {
  titulo: string
  marca: string
  descricao: string
  preco: number
  imageUrl: string
}

@Component({
  selector: 'app-tenis-card-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgFor, 
    MatCardActions, MatCardContent, MatCardTitle, MatCardFooter],
  templateUrl: './tenis-card-list.component.html',
  styleUrl: './tenis-card-list.component.css'
})
export class TenisCardListComponent implements OnInit {
  tenis: Tenis[] = [];
  cards = signal<Card[]>([]);

  constructor(private tenisService: TenisService) {

  }
  ngOnInit(): void {
    this.carregarTeniss();
  }

  carregarTeniss() {
    // buscando as tenis
      this.tenisService.findAll(0,10).subscribe (data => {
      this.tenis = data;
      this.carregarCards();
    })
  }

  carregarCards() {
    const cards: Card[] = [];
    this.tenis.forEach(tenis => {
      cards.push({
        titulo: tenis.modelo,
        marca: tenis.marca.label,
        descricao: tenis.descricao,
        preco: tenis.preco,
        imageUrl: this.tenisService.getUrlImage(tenis.nomeImagem)
      })
    });
    this.cards.set(cards);
  }

  

}
