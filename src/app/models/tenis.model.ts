import { Marca } from './marca.model';

export class Tenis {
  id!: number;
  descricao!: string;
  marca!: Marca;
  modelo!: string;
  tamanho!: Tamanho;
}
