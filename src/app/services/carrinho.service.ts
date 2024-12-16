import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemCarrinho } from '../models/item-carrinho';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    this.inicializarCarrinho();
  }

  private inicializarCarrinho(): void {
    const carrinhoArmazenado =
      this.localStorageService.getItem('carrinho') || [];
    this.carrinhoSubject.next(carrinhoArmazenado);
  }

  adicionar(itemCarrinho: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find(
      (item) => item.id === itemCarrinho.id
    );

    if (itemExistente) {
      itemExistente.quantidade += itemCarrinho.quantidade || 1;
    } else {
      // Garantir que novos itens tenham quantidade mínima de 1
      itemCarrinho.quantidade = itemCarrinho.quantidade || 1;
      carrinhoAtual.push(itemCarrinho);
    }

    this.atualizarCarrinho(carrinhoAtual);
  }

  aumentarQuantidade(item: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find((i) => i.id === item.id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
      this.atualizarCarrinho(carrinhoAtual);
    }
  }

  diminuirQuantidade(item: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find((i) => i.id === item.id);

    if (itemExistente && itemExistente.quantidade > 1) {
      itemExistente.quantidade -= 1;
      this.atualizarCarrinho(carrinhoAtual);
    }
  }

  removerItem(itemCarrinho: ItemCarrinho): void {
    const carrinhoAtualizado = this.carrinhoSubject.value.filter(
      (item) => item.id !== itemCarrinho.id
    );
    this.atualizarCarrinho(carrinhoAtualizado);
  }

  limparCarrinho(): void {
    this.localStorageService.removeItem('carrinho');
    this.carrinhoSubject.next([]);
  }

  obterItens(): ItemCarrinho[] {
    return this.carrinhoSubject.value;
  }

  obterQuantidadeTotal(): Observable<number> {
    return this.carrinho$.pipe(
      map((items) => items.reduce((total, item) => total + item.quantidade, 0))
    );
  }

  obterValorTotal(): Observable<number> {
    return this.carrinho$.pipe(
      map((items) =>
        items.reduce((total, item) => total + item.quantidade * item.preco, 0)
      )
    );
  }

  verificarItemNoCarrinho(id: number): boolean {
    return this.carrinhoSubject.value.some((item) => item.id === id);
  }

  private atualizarCarrinho(carrinho: ItemCarrinho[]): void {
    this.carrinhoSubject.next(carrinho);
    this.localStorageService.setItem('carrinho', carrinho);
  }
}
