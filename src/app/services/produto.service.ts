import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/produtos';

  constructor(private httpClient: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(this.baseUrl);
  }
}
