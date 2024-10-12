import { Injectable } from '@angular/core';
import { Estado } from '../models/estado.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  private baseUrl: string = 'http://localhost:8080/estados';

  constructor(private httpClient: HttpClient) {}

  create(estado: Estado): Observable<Estado> {
    return this.httpClient.post<Estado>(`${this.baseUrl}`, estado);
  }

  update(estado: Estado): Observable<Estado> {
    return this.httpClient.put<Estado>(`${this.baseUrl}/${estado.id}`, estado);
  }

  delete(estado: Estado): Observable<any> {
    return this.httpClient.delete<Estado>(`${this.baseUrl}/${estado.id}`);
  }

  findAll(page: number, pageSize: number): Observable<Estado[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Estado[]>(`${this.baseUrl}`, { params });
  }

  findById(id: string): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.baseUrl}/${id}`);
  }

  findByNome(
    nome: string,
    page: number,
    pageSize: number
  ): Observable<Estado[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Estado[]>(`${this.baseUrl}/search/${nome}`, {
      params,
    });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByCodigo(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/search/${nome}/count`);
  }
}
