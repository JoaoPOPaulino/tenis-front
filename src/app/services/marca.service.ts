import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  private baseUrl = 'http://localhost:8080/marcas';

  constructor(private httpClient: HttpClient) {}

  findAll(page: number, pageSize: number): Observable<Marca[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Marca[]>(`${this.baseUrl}`, { params });
  }

  findById(id: number): Observable<Marca> {
    return this.httpClient.get<Marca>(`${this.baseUrl}/${id}`);
  }

  create(marca: Marca): Observable<Marca> {
    return this.httpClient.post<Marca>(this.baseUrl, marca);
  }

  update(marca: Marca): Observable<Marca> {
    return this.httpClient.put<any>(`${this.baseUrl}/${marca.id}`, Marca);
  }

  delete(marca: Marca): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${marca.id}`);
  }

  findByNome(
    nome: string,
    page: number,
    pageSize: number
  ): Observable<Marca[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Marca[]>(`${this.baseUrl}/search/${nome}`, {
      params,
    });
  }
}
