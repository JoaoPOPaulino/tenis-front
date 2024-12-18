import { Cartao } from './cartao.model';
import { Pedido } from './pedido.model';
import { StatusPagamento } from './status-pagamento.enum';
import { TipoPagamento } from './tipo.pagamento';

export class Pagamento {
  id!: number;
  tipoPagamento!: TipoPagamento;
  statusPagamento!: StatusPagamento;
  valor!: number;
  pedido!: Pedido;
  cartao?: Cartao; // Tornar opcional
  chavePix!: string;
  numeroBoleto!: string;
  dataPagamento!: Date;
}
