import { Injectable } from '@angular/core';
import { Fornecedor } from '../models/fornecedor.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private baseUrl = 'http://localhost:8080/fornecedores';
  private tenisUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  create(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(`${this.baseUrl}`, fornecedor);
  }

  update(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.put<Fornecedor>(
      `${this.baseUrl}/${fornecedor.id}`,
      fornecedor
    );
  }

  delete(fornecedor: Fornecedor): Observable<any> {
    return this.httpClient.delete<Fornecedor>(
      `${this.baseUrl}/${fornecedor.id}`
    );
  }

  findAll(page: number, pageSize: number): Observable<Fornecedor[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Fornecedor[]>(`${this.baseUrl}`, { params });
  }

  findById(id: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.baseUrl}/${id}`);
  }

  findByNome(
    nome: string,
    page: number,
    pageSize: number
  ): Observable<Fornecedor[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Fornecedor[]>(`${this.baseUrl}/search/${nome}`, {
      params,
    });
  }
}
