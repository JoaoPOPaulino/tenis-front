import { Fornecedor } from './fornecedor.model';

export class Produto {
  id!: number;
  nome!: string;
  preco!: number;
  estoque!: number;
  fornecedor!: Fornecedor;
}
