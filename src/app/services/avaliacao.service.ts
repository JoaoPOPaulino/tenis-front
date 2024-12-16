import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/avaliacao.model';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  private baseUrl = 'http://localhost:8080/avaliacoes';

  constructor(private http: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Avaliacao[]> {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.append('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.append('pageSize', pageSize.toString());
    }

    return this.http.get<Avaliacao[]>(this.baseUrl, { params });
  }

  findById(id: number): Observable<Avaliacao> {
    return this.http.get<Avaliacao>(`${this.baseUrl}/${id}`);
  }

  findByConteudo(
    conteudo: string,
    page?: number,
    pageSize?: number
  ): Observable<Avaliacao[]> {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.append('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.append('pageSize', pageSize.toString());
    }

    return this.http.get<Avaliacao[]>(
      `${this.baseUrl}/search/conteudo/${conteudo}`,
      { params }
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  countByConteudo(conteudo: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/search/${conteudo}`);
  }

  insert(avaliacao: Avaliacao): Observable<Avaliacao> {
    const data = this.prepareData(avaliacao);
    return this.http.post<Avaliacao>(this.baseUrl, data);
  }

  update(avaliacao: Avaliacao): Observable<Avaliacao> {
    const data = this.prepareData(avaliacao);
    return this.http.put<Avaliacao>(`${this.baseUrl}/${avaliacao.id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  private prepareData(avaliacao: Avaliacao) {
    return {
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
  }
}
