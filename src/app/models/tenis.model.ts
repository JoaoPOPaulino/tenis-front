import { Marca } from './marca.model';
import { Tamanho } from './tamanho.enum';
import { Produto } from './produto.model';

export class Tenis extends Produto {
  marca!: Marca;
  modelo!: string;
  tamanho!: Tamanho;
  nomeImagem!: string;
}