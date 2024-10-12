import { Component, OnInit } from '@angular/core';
import { Produto } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css'],
})
export class ProdutoListComponent implements OnInit {
  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe((data) => {
      this.produtos = data;
    });
  }
}
