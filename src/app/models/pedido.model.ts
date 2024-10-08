import { StatusPedido } from "./status-pedido.model";
import { Usuario } from "./usuario.model";

export class Pedido {
    id!: number;
    dataPedido!: Date;
    cliente!: Usuario;
    valorTotal!: number;
    status!: StatusPedido;

}
