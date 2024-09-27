import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tenis } from '../models/tenis.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenisService {

  private baseUrl = 'http://localhost:8080/tenis';

  constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Tenis[]> {
    return this.httpClient.get<Tenis[]>(this.baseUrl); 
  }

  findById(id: string): Observable<Tenis> {
    return this.httpClient.get<Tenis>(`${this.baseUrl}/${id}`); 
  }

  insert(Tenis: Tenis): Observable<Tenis> {
    const data = {
      nome: Tenis.nome,
      tamanho: Tenis.tamanho
    }
    return this.httpClient.post<Tenis>(this.baseUrl, data);
  }

  update(Tenis: Tenis): Observable<Tenis> {
    const data = {
      nome: Tenis.nome,
      tamanho: Tenis.tamanho
    }
    return this.httpClient.put<any>(`${this.baseUrl}/${Tenis.id}`, data); 
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`); 
  }
}
