import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';

@Injectable({
  providedIn: 'root',
})
export class TenisService {
  private baseUrl = 'http://localhost:8080/teniss';

  constructor(private httpClient: HttpClient) {}

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  findAll(page?: number, pageSize?: number): Observable<Tenis[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }

    console.log(params);

    return this.httpClient.get<Tenis[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<Tenis> {
    return this.httpClient.get<Tenis>(`${this.baseUrl}/${id}`);
  }

  findByModelo(
    titulo: string,
    page?: number,
    pageSize?: number
  ): Observable<Tenis[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }
    return this.httpClient.get<Tenis[]>(
      `${this.baseUrl}/search/tenis/${Tenis}`,
      { params }
    );
  }

  insert(tenis: Tenis): Observable<Tenis> {
    const data = {
      modelo: tenis.modelo,
      marca: tenis.marca.label,
      descricao: tenis.descricao,
      preco: tenis.preco,
    };
    return this.httpClient.post<Tenis>(this.baseUrl, data);
  }

  update(tenis: Tenis): Observable<Tenis> {
    const data = {
      modelo: tenis.modelo,
      marca: tenis.marca.label,
      descricao: tenis.descricao,
      preco: tenis.preco,
    };
    return this.httpClient.put<any>(`${this.baseUrl}/${tenis.id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`);
  }
}
