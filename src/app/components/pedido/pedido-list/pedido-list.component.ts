import { Component } from '@angular/core';
import { Pedido } from '../../../models/pedido.model';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-pedido-list',
  standalone: true,
  imports: [],
  templateUrl: './pedido-list.component.html',
  styleUrl: './pedido-list.component.css'
})
export class PedidoListComponent {
  pedidos: Pedido[] = [];
  displayedColumns: string[] = ['id', 'dataPedido', 'cliente',  'valorTotal',  'acoes'];

  constructor(private pedidoService: PedidoService){

  }

  ngOnInit(): void{
    this.carregarPedidos();
  }

  carregarPedidos(): void{
    this.pedidoService.obterPedido().subscribe((pedidos: Pedido[]) => {
      this.pedidos = this.pedidos;
    });
  }


}
