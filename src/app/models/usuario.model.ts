import { Cartao } from './cartao.model';
import { Endereco } from './endereco.model';
import { Telefone } from './telefone.model';
import { TipoUsuario } from './tipo-usuario.enum';

export class Usuario {
  id!: number;
  nome!: string;
  email!: string;
  login!: string;
  senha!: string;
  username!: string; // Campo adicionado
  tipoUsuario!: TipoUsuario;
  telefones!: Telefone[];
  enderecos!: Endereco[];
  cartoes!: Cartao[];
}
