import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css'],
})
export class CarrinhoComponent implements OnInit, OnDestroy {
  carrinhoItens: ItemCarrinho[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carrinhoService.carrinho$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itens) => {
        this.carrinhoItens = itens;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removerItem(item: ItemCarrinho): void {
    this.carrinhoService.removerItem(item);
    this.snackBar.open('Item removido do carrinho', 'OK', {
      duration: 3000,
    });
  }

  atualizarQuantidade(item: ItemCarrinho, aumento: boolean): void {
    if (aumento) {
      this.carrinhoService.aumentarQuantidade(item);
    } else if (item.quantidade > 1) {
      this.carrinhoService.diminuirQuantidade(item);
    }
  }

  calcularTotal(): number {
    return this.carrinhoItens.reduce(
      (total, item) => total + item.quantidade * item.preco,
      0
    );
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
    this.snackBar.open('Carrinho limpo', 'OK', {
      duration: 3000,
    });
  }

  continuarComprando(): void {
    this.router.navigate(['/tenis']);
  }

  finalizarCompra(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar
        .open('Por favor, faça login para continuar', 'Login', {
          duration: 5000,
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: '/carrinho' },
          });
        });
      return;
    }

    if (this.carrinhoItens.length === 0) {
      this.snackBar.open('Seu carrinho está vazio', 'OK', {
        duration: 3000,
      });
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
