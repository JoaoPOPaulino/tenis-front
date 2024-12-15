import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';
import { Marca } from '../models/marca.model';

@Injectable({
  providedIn: 'root'
})
export class TenisService {
  private baseUrl = 'http://localhost:8080/tenis';

  constructor(private http: HttpClient) {}

  findAll(page: number = 0, size: number = 10): Observable<Tenis[]> {
    return this.http.get<Tenis[]>(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  findById(id: number): Observable<Tenis> {
    return this.http.get<Tenis>(`${this.baseUrl}/${id}`);
  }

  findMarcas(): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.baseUrl}/marcas`);
  }

  insert(tenis: Tenis): Observable<Tenis> {
    return this.http.post<Tenis>(this.baseUrl, tenis);
  }

  update(tenis: Tenis): Observable<Tenis> {
    return this.http.put<Tenis>(`${this.baseUrl}/${tenis.id}`, tenis);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<Tenis> {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', nomeImagem);
    formData.append('imagem', imagem);
    return this.http.patch<Tenis>(`${this.baseUrl}/image/upload`, formData);
  }

  getUrlImage(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }
}
