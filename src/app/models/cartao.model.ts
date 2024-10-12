import { TipoCartao } from './tipo-cartao.model';

export class Cartao {
  id!: number;
  tipo!: TipoCartao;
  numero!: string;
  cvv!: string;
  validade!: Date;
  titular!: string;
  cpf!: string;
}
