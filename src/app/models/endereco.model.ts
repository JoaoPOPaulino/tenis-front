import { Cidade } from './cidade.model';
import { Usuario } from './usuario.model';

export class Endereco {
  id?: number;
  cidade!: Cidade;
  cep!: string;
  quadra!: string;
  rua!: string;
  numero!: string;
  complemento!: string;
  usuario!: Usuario;
  principal!: boolean;
  ativo!: boolean;
}
