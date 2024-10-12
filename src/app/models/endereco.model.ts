import { Cidade } from './cidade.model';

export class Endereco {
  id!: number;
  cidade!: Cidade;
  cep!: string;
  quadra!: string;
  rua!: string;
  numero!: string;
  complemento!: string;
}
