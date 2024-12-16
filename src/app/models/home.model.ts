import { Marca } from './marca.model';
import { Produto } from './produto.model';
//import { Home }  from './home.model';

export interface Home {
  destaques: Produto[];
  bannerPrincipal: string;
  tituloPagina: string;
  categorias?: string[];
  marcasEmDestaque?: Marca[];
}
