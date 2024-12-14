import { TipoCartao } from './tipo-cartao.model';
import { Usuario } from './usuario.model';

export class Cartao {
  id!: number;
  tipoCartao!: TipoCartao;
  numero!: string;
  cvv!: string;
  validade!: Date;
  titular!: string;
  cpf!: string;
  usuario!: Usuario;
  ativo!: boolean;
}
