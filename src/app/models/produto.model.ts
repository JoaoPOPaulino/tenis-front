import { Fornecedor } from './fornecedor.model';

export class Produto {
  id!: number;
  nome!: string;
  preco!: number;
  estoque!: number;
  fornecedor!: Fornecedor;
  descricao!: string;     // Adicionando descricao aqui
  imagemUrl?: string;     // Mantendo imagemUrl como opcional
}