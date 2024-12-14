import { Cartao } from './cartao.model';
import { Endereco } from './endereco.model';
import { Item } from './item.model';
import { Usuario } from './usuario.model';

export class Pedido {
  id!: number;
  data!: Date;
  usuario!: Usuario;
  itens: Item[] = [];
  total!: number;
  endereco!: Endereco;
  cartao!: Cartao;
}
