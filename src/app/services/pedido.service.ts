import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private baseUrl = 'http://localhost:8080/pedido';


  constructor(private http: HttpClient) { }

  obterPedido(): Observable<Pedido[]>{
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  
}
