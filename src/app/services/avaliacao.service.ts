import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/avaliacao.model';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  private baseUrl = 'http://localhost:8080/avaliacoes';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Avaliacao[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }

    return this.httpClient.get<Avaliacao[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByConteudo(conteudo: string): Observable<number> {
    return this.httpClient.get<number>(
      `${this.baseUrl}/count/search/${conteudo}`
    );
  }

  findByConteudo(
    conteudo: string,
    page?: number,
    pageSize?: number
  ): Observable<Avaliacao[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }
    return this.httpClient.get<Avaliacao[]>(
      `${this.baseUrl}/search/conteudo/${conteudo}`,
      { params }
    );
  }

  findById(id: string): Observable<Avaliacao> {
    return this.httpClient.get<Avaliacao>(`${this.baseUrl}/${id}`);
  }

  insert(avaliacao: Avaliacao): Observable<Avaliacao> {
    const data = {
      tenis: {
        id: avaliacao.tenis.id,
        nome: avaliacao.tenis.nome,
      },
      usuario: {
        id: avaliacao.usuario.id,
        nome: avaliacao.usuario.nome,
      },
      conteudo: avaliacao.conteudo,
      nota: avaliacao.nota,
      dataAvaliacao: avaliacao.dataAvaliacao,
      ativa: avaliacao.ativa,
    };
    return this.httpClient.post<Avaliacao>(this.baseUrl, data);
  }

  update(avaliacao: Avaliacao): Observable<Avaliacao> {
    const data = {
      tenis: {
        id: avaliacao.tenis.id,
        nome: avaliacao.tenis.nome,
      },
      usuario: {
        id: avaliacao.usuario.id,
        nome: avaliacao.usuario.nome,
      },
      conteudo: avaliacao.conteudo,
      nota: avaliacao.nota,
      dataAvaliacao: avaliacao.dataAvaliacao,
      ativa: avaliacao.ativa,
    };
    return this.httpClient.put<Avaliacao>(
      `${this.baseUrl}/${avaliacao.id}`,
      data
    );
  }

  delete(avaliacao: Avaliacao): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${avaliacao.id}`);
  }
}
