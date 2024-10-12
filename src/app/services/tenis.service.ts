import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tenis } from '../models/tenis.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TenisService {
  private baseUrl = 'http://localhost:8080/tenis';

  constructor(private httpClient: HttpClient) {}

  create(tenis: Tenis): Observable<Tenis> {
    const data = {
      descricao: tenis.descricao,
      idMarca: tenis.marca.id,
      modelo: tenis.modelo,
      preco: tenis.preco,
    };
    return this.httpClient.post<Tenis>(`${this.baseUrl}`, data);
  }

  update(tenis: Tenis): Observable<Tenis> {
    const data = {
      descricao: tenis.descricao,
      idMarca: tenis.marca.id,
      modelo: tenis.modelo,
      preco: tenis.preco,
    };
    return this.httpClient.put<any>(`${this.baseUrl}/${tenis.id}`, data);
  }

  delete(tenis: Tenis): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${tenis.id}`);
  }

  findAll(page: number, pageSize: number): Observable<Tenis[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Tenis[]>(`${this.baseUrl}`, { params });
  }

  findById(id: string): Observable<Tenis> {
    return this.httpClient.get<Tenis>(`${this.baseUrl}/${id}`);
  }

  findByNome(
    nome: string,
    page: number,
    pageSize: number
  ): Observable<Tenis[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Tenis[]>(`${this.baseUrl}/search/${nome}`, {
      params,
    });
  }

  findByModelo(
    modelo: string,
    page: number,
    pageSize: number
  ): Observable<Tenis[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Tenis[]>(`${this.baseUrl}/search/${modelo}`, {
      params,
    });
  }
}
