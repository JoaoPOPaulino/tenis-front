import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../services/usuario.service';
import { PagamentoService } from '../../../services/pagamento.service'; // Importar o serviço de pagamento
import { CarrinhoService } from '../../../services/carrinho.service'; // Importar o serviço de carrinho
import { Pagamento } from '../../../models/pagamento.model';
import { TipoPagamento } from '../../../models/tipo.pagamento';
import { StatusPagamento } from '../../../models/status-pagamento.enum';
import { Usuario } from '../../../models/usuario.model';
import { Item } from '../../../models/item.model';
import { Pedido } from '../../../models/pedido.model';
import { Cartao } from '../../../models/cartao.model';
import { ItemCarrinho } from '../../../models/item-carrinho';

@Component({
  selector: 'app-finalizar-compra',
  standalone: true,
  imports: [],
  templateUrl: './finalizar-compra.component.html',
  styleUrls: ['./finalizar-compra.component.css'],
})
export class FinalizarCompraComponent implements OnInit {
  pagamentoSelecionado: string = ''; // Exemplo, deve ser atualizado conforme seu fluxo
  progress: number = 0;
  usuario!: Usuario;
  carrinhoItens: ItemCarrinho[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private pagamentoService: PagamentoService, // Injetar o serviço de pagamento
    private carrinhoService: CarrinhoService, // Injetar o serviço de carrinho
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obter o usuário logado
    this.usuarioService.getUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: (error) => {
        console.error('Erro ao obter usuário logado', error);
        this.snackBar.open('Erro ao obter usuário logado', 'Ok', {
          duration: 3000,
        });
      },
    });

    // Obter os itens do carrinho
    this.carrinhoItens = this.carrinhoService.obterItens();
  }

  finalizarCompra() {
    if (!this.usuario.telefones?.length || !this.usuario.enderecos?.length) {
      this.snackBar.open(
        'Por favor, complete seu cadastro antes de finalizar a compra.',
        'Ok',
        { duration: 3000 }
      );
      this.router.navigate(['/perfil']); // Redireciona para a página de perfil
      return;
    }

    if (
      this.pagamentoSelecionado === 'cartao' &&
      !this.usuario.cartoes?.length
    ) {
      this.snackBar.open(
        'Nenhum cartão cadastrado. Cadastre um cartão para continuar.',
        'Ok',
        { duration: 3000 }
      );
      this.router.navigate(['/cartoes']); // Redireciona para a página de cartões
      return;
    }

    // Prosseguir com a compra
    this.processarPagamento();
  }

  processarPagamento() {
    const valorTotal = this.carrinhoItens.reduce(
      (total, item) => total + item.quantidade * item.preco,
      0
    );

    // Converter ItemCarrinho para Item
    const itensPedido: Item[] = this.carrinhoItens.map((itemCarrinho) => ({
      id: itemCarrinho.id,
      quantidade: itemCarrinho.quantidade,
      preco: itemCarrinho.preco,
      tenis: itemCarrinho.tenis,
      pedido: { id: 0 } as Pedido, // Placeholder para o pedido
    }));

    const dadosPagamento: Pagamento = {
      id: 0, // Será gerado pelo backend
      tipoPagamento:
        this.pagamentoSelecionado === 'cartao'
          ? TipoPagamento.CARTAO_CREDITO
          : TipoPagamento.PIX, // Exemplo de tipo de pagamento
      statusPagamento: StatusPagamento.PENDENTE,
      valor: valorTotal,
      pedido: { id: 0, itens: itensPedido }, // Exemplo de pedido
      cartao:
        this.pagamentoSelecionado === 'cartao'
          ? this.usuario.cartoes[0]
          : ({} as Cartao), // Valor padrão para cartao
      chavePix: this.pagamentoSelecionado === 'pix' ? 'chave-pix-exemplo' : '',
      numeroBoleto: '',
      dataPagamento: new Date(),
    };

    this.pagamentoService.processarPagamento(dadosPagamento).subscribe({
      next: (response) => {
        console.log('Pagamento processado com sucesso', response);
        this.snackBar.open('Pagamento processado com sucesso!', 'Ok', {
          duration: 3000,
        });
        this.carrinhoService.limparCarrinho(); // Limpar o carrinho após a compra
        this.router.navigate(['/confirmacao-compra']); // Redireciona para a página de confirmação de compra
      },
      error: (error) => {
        console.error('Erro ao processar pagamento', error);
        this.snackBar.open('Erro ao processar pagamento', 'Ok', {
          duration: 3000,
        });
      },
    });
  }

  simulateProgress(): void {
    let interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 5; // Aumenta o progresso de 5% a cada intervalo
      } else {
        clearInterval(interval); // Quando chegar a 100%, para de atualizar
      }
    }, 200); // Intervalo de 200ms
  }
}
