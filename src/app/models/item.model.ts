import { Tenis } from './tenis.model';
import { Pedido } from './pedido.model';

export class Item {
  id!: number;
  quantidade!: number;
  preco!: number;
  tenis!: Tenis;
  pedido!: Pedido;
}
