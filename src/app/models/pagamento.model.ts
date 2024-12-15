import { Cartao } from './cartao.model';
import { Pedido } from './pedido.model';
import { StatusPagamento } from './status-pagamento.enum';

export class Pagamento {
  id!: number;
  tipoPagamento!: Pagamento;
  statusPagamento!: StatusPagamento;
  valor!: number;
  pedido!: Pedido;
  cartao!: Cartao;
  chavePix!: string;
  numeroBoleto!: string;
  dataPagamento!: Date;
}