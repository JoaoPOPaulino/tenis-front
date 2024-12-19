import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Models & Services
import { ItemCarrinho } from '../../models/item-carrinho';
import { CarrinhoService } from '../../services/carrinho.service';
import { AuthService } from '../../services/auth.service';

// Material Imports
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css'],
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  carrinhoItens: ItemCarrinho[] = [];
  isLoading = false;
  valorTotal = 0;
  quantidadeTotal = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Observables do carrinho usando pipe async
    this.carrinhoService.carrinho$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itens) => {
        this.carrinhoItens = itens;
      });

    this.carrinhoService
      .obterValorTotal()
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => {
        this.valorTotal = total;
      });

    this.carrinhoService
      .obterQuantidadeTotal()
      .pipe(takeUntil(this.destroy$))
      .subscribe((quantidade) => {
        this.quantidadeTotal = quantidade;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Métodos de manipulação de quantidade
  aumentarQuantidade(item: ItemCarrinho): void {
    if (item.quantidade < item.tenis.estoque) {
      this.carrinhoService.aumentarQuantidade(item);
    } else {
      this.showSnackbar(`Quantidade máxima disponível: ${item.tenis.estoque}`);
    }
  }

  diminuirQuantidade(item: ItemCarrinho): void {
    if (item.quantidade > 1) {
      this.carrinhoService.diminuirQuantidade(item);
    } else {
      this.confirmarRemocao(item);
    }
  }

  private confirmarRemocao(item: ItemCarrinho): void {
    if (confirm(`Deseja remover ${item.tenis.modelo} do carrinho?`)) {
      this.removerItem(item);
    }
  }

  removerItem(item: ItemCarrinho): void {
    this.carrinhoService.removerItem(item);
    this.showSnackbar(`${item.tenis.modelo} removido do carrinho`);
  }

  limparCarrinho(): void {
    if (confirm('Deseja realmente limpar o carrinho?')) {
      this.carrinhoService.limparCarrinho();
      this.showSnackbar('Carrinho limpo com sucesso');
    }
  }

  continuarComprando(): void {
    this.router.navigate(['/ecommerce']);
  }

  finalizarCompra(): void {
    if (this.carrinhoItens.length === 0) {
      this.showSnackbar('Seu carrinho está vazio');
      return;
    }

    // Verifica autenticação
    if (this.authService.isTokenExpired()) {
      this.authService.logout(); // Usa o método logout unificado
      this.showSnackbar('Por favor, faça login para continuar a compra');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    // Verifica usuário logado usando o valor atual
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      this.showSnackbar('Por favor, faça login para continuar a compra');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    // Verifica estoque
    const itemSemEstoque = this.carrinhoItens.find(
      (item) => item.quantidade > item.tenis.estoque
    );

    if (itemSemEstoque) {
      this.showSnackbar(
        `Estoque insuficiente para ${itemSemEstoque.tenis.modelo}`
      );
      return;
    }

    // Procede com a finalização da compra
    this.isLoading = true;

    // Simulação temporária
    setTimeout(() => {
      this.carrinhoService.limparCarrinho();
      this.isLoading = false;
      this.showSnackbar('Compra finalizada com sucesso!');
      this.router.navigate(['/pedidos']);
    }, 2000);
  }

  calcularSubtotal(item: ItemCarrinho): number {
    return item.quantidade * item.preco;
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
