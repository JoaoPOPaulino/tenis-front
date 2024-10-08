import { Component } from '@angular/core';
import { StatusPedido } from '../../../models/status-pedido.model';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [],
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.css'
})
export class PedidoFormComponent {
  statusPedido= StatusPedido;
  statusList = Object.values(StatusPedido);
}
