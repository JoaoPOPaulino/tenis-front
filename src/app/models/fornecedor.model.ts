import { Endereco } from './endereco.model';

export class Fornecedor {
  id!: number;
  nome!: string;
  cnpj!: string;
  endereco!: Endereco;
}
