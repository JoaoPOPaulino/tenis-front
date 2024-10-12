import { Cartao } from './cartao.model';
import { Endereco } from './endereco.model';
import { Telefone } from './telefone.model';
import { TipoUsuario } from './tipo-usuario.model';

export class Usuario {
  id!: number;
  nome!: string;
  email!: string;
  login!: string;
  endereco: Endereco[] = [];
  cartao: Cartao[] = [];
  telefone: Telefone[] = [];
  tipoUsuario!: TipoUsuario;
  senha!: string;
}
