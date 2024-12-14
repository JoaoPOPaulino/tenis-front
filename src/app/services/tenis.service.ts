import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';
import { Marca } from '../models/marca.model';

@Injectable({
  providedIn: 'root',
})
export class TenisService {
  private baseUrl = 'http://localhost:8080/tenis';

  constructor(private httpClient: HttpClient) {}

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<Tenis>(
      `${this.baseUrl}/image/upload`,
      formData
    );
  }

  findMarcas(): Observable<Marca[]> {
    return this.httpClient.get<Marca[]>(`${this.baseUrl}/marcas`);
  }

  findTamanhos(): Observable<Tamanho[]> {
    return this.httpClient.get<Tamanho[]>(`${this.baseUrl}/tamanhos`);
  }

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

  insert(tenis: Tenis): Observable<Tenis> {
    const data = {
      nome: tenis.
      descricao: tenis.descricao,
      modelo: tenis.modelo,
      idMarca: tenis.marca.id,
      idTamanho: tenis.tamanho.id,
      preco: tenis.preco,
      estoque: tenis.estoque,
    };
    return this.httpClient.post<Tenis>(this.baseUrl, data);
  }

  update(tenis: Tenis): Observable<Tenis> {
    const data = {
      nome: tenis.nome,
      descricao: tenis.descricao,
      modelo: tenis.modelo,
      idMarca: tenis.marca.id,
      idTamanho: tenis.tamanho.id,
      preco: tenis.preco,
      estoque: tenis.estoque,
    };
    return this.httpClient.put<Tenis>(`${this.baseUrl}/${tenis.id}`, data);
  }
}
