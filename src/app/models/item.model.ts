import { Pedido } from './pedido.model';
import { Tenis } from './tenis.model';

export interface Item {
  id?: number;
  quantidade: number;
  preco: number;
  tenis: Tenis;
  pedido: Pedido;
}