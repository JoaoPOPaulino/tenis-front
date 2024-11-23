import { Marca } from './marca.model';

export class Tenis {
  id!: number;
  descricao!: string;
  marca!: Marca;
  modelo!: string;
  preco!: number;
  nomeImagem!: string;
}
