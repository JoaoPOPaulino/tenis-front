import { Injectable } from '@angular/core';
import { Cidade } from '../models/cidade.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CidadeService {
  private baseUrl: string = 'http://localhost:8080/cidades';

  constructor(private httpClient: HttpClient) {}

  create(cidade: Cidade): Observable<Cidade> {
    const obj = {
      nome: cidade.nome,
      idEstado: cidade.estado.id,
    };

    return this.httpClient.post<Cidade>(`${this.baseUrl}`, obj);
  }

  update(cidade: Cidade): Observable<Cidade> {
    const obj = {
      nome: cidade.nome,
      idEstado: cidade.estado.id,
    };

    return this.httpClient.put<Cidade>(`${this.baseUrl}/${cidade.id}`, obj);
  }

  delete(cidade: Cidade): Observable<any> {
    return this.httpClient.delete<Cidade>(`${this.baseUrl}/${cidade.id}`);
  }

  findAll(page: number, pageSize: number): Observable<Cidade[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Cidade[]>(`${this.baseUrl}`, { params });
  }

  findById(id: string): Observable<Cidade> {
    return this.httpClient.get<Cidade>(`${this.baseUrl}/${id}`);
  }

  findByNome(
    nome: string,
    page: number,
    pageSize: number
  ): Observable<Cidade[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Cidade[]>(`${this.baseUrl}/search/${nome}`, {
      params,
    });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/search/${nome}/count`);
  }
}
