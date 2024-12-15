import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private baseUrl = 'http://localhost:8080/marcas';

  constructor(private http: HttpClient) {}

  insert(marca: Marca): Observable<Marca> {
    const data = {
      nome: marca.nome
    };
    return this.http.post<Marca>(this.baseUrl, data);
  }

  update(marca: Marca): Observable<Marca> {
    const data = {
      nome: marca.nome
    };
    return this.http.put<Marca>(`${this.baseUrl}/${marca.id}`, data);
  }
}
