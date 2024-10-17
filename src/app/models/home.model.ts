import { Produto } from './produto.model';
//import { Home }  from './home.model';


export class Home {
  destaques: Produto[];
  bannerPrincipal: string;
  tituloPagina: string;

  constructor() {
    this.destaques = [];
    this.bannerPrincipal = '';
    this.tituloPagina = 'Sneaker Paradise';
  }
}