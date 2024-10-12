import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/avaliacao.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  private baseUrl: string = 'http://localhost:8080/avaliacoes';

  constructor(private httpClient: HttpClient) {}

  create(avaliacao: Avaliacao): Observable<Avaliacao> {
    return this.httpClient.post<Avaliacao>(`${this.baseUrl}`, avaliacao);
  }

  update(avaliacao: Avaliacao): Observable<Avaliacao> {
    return this.httpClient.put<Avaliacao>(
      `${this.baseUrl}/${avaliacao.id}`,
      avaliacao
    );
  }

  delete(avaliacao: Avaliacao): Observable<any> {
    return this.httpClient.delete<Avaliacao>(`${this.baseUrl}/${avaliacao.id}`);
  }

  findAll(page: number, pageSize: number): Observable<Avaliacao[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Avaliacao[]>(`${this.baseUrl}`, { params });
  }

  findById(id: string): Observable<Avaliacao> {
    return this.httpClient.get<Avaliacao>(`${this.baseUrl}/${id}`);
  }

  findByNome(
    nome: string,
    page: number,
    pageSize: number
  ): Observable<Avaliacao[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Avaliacao[]>(`${this.baseUrl}/search/${nome}`, {
      params,
    });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByConteudo(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/search/${nome}/count`);
  }
}
