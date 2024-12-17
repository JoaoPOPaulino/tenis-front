// Atualização do TenisService para incluir fornecedor:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';

@Injectable({
  providedIn: 'root',
})
export class TenisService {
  private baseUrl = 'http://localhost:8080/tenis';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Tenis[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }

    return this.httpClient.get<Tenis[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findByNome(
    nome: string,
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
    return this.httpClient.get<Tenis[]>(`${this.baseUrl}/search/nome/${nome}`, {
      params,
    });
  }

  findById(id: string): Observable<Tenis> {
    return this.httpClient.get<Tenis>(`${this.baseUrl}/${id}`);
  }

  insert(tenis: Tenis): Observable<Tenis> {
    const data = {
      nome: tenis.nome,
      preco: tenis.preco,
      estoque: tenis.estoque,
      fornecedor: {
        id: tenis.fornecedor.id,
        nome: tenis.fornecedor.nome,
      },
      descricao: tenis.descricao,
      marca: {
        id: tenis.marca.id,
        nome: tenis.marca.nome,
        nomeImagem: tenis.marca.nomeImagem,
      },
      modelo: tenis.modelo,
      tamanho: tenis.tamanho,
      nomeImagem: tenis.nomeImagem,
    };
    return this.httpClient.post<Tenis>(this.baseUrl, data);
  }

  update(tenis: Tenis): Observable<Tenis> {
    const data = {
      nome: tenis.nome,
      preco: tenis.preco,
      estoque: tenis.estoque,
      fornecedor: {
        id: tenis.fornecedor.id,
        nome: tenis.fornecedor.nome,
      },
      descricao: tenis.descricao,
      marca: {
        id: tenis.marca.id,
        nome: tenis.marca.nome,
        nomeImagem: tenis.marca.nomeImagem,
      },
      modelo: tenis.modelo,
      tamanho: tenis.tamanho,
      nomeImagem: tenis.nomeImagem,
    };
    return this.httpClient.put<Tenis>(`${this.baseUrl}/${tenis.id}`, data);
  }

  delete(tenis: Tenis): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${tenis.id}`);
  }

  uploadImagem(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagem', file);
    return this.httpClient.post(`${this.baseUrl}/${id}/imagem`, formData);
  }

  getImagemUrl(id: number): string {
    return `${this.baseUrl}/${id}/imagem`;
  }
}
