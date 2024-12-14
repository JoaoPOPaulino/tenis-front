import { Tenis } from './tenis.model';
import { Usuario } from './usuario.model';

export class Avaliacao {
  id!: number;
  tenis!: Tenis;
  usuario!: Usuario;
  conteudo!: string;
  nota!: number;
  dataAvaliacao!: Date;
  ativa!: boolean;
}
