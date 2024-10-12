import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/fornecedor.model';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private baseUrl = 'http://localhost:8080/fornecedores';

  constructor(private httpClient: HttpClient) {}

  getFornecedores(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(this.baseUrl);
  }
}
