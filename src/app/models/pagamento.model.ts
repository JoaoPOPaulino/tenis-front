import { Cartao } from './cartao.model';

export class Pagamento {
  id!: number;
  tipoPagamento!: TipoPagamento;
  statusPagamento!: StatusPagamento;
  valor!: number;
  pedido!: Pedido;
  cartao!: Cartao;
  chavePix!: string;
  numeroBoleto!: string;
  dataPagamento!: Date;
}
