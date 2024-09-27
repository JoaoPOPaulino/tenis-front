import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private baseUrl = 'http://localhost:8080/marcas';

  constructor(private httpClient: HttpClient) {
   }

   findAll(): Observable<Marca[]> {
    return this.httpClient.get<Marca[]>(this.baseUrl); 
  }

  findById(id: number): Observable<Marca> {
    return this.httpClient.get<Marca>(`${this.baseUrl}/${id}`); 
  }

  insert(marca: Marca): Observable<Marca> {
    return this.httpClient.post<Marca>(this.baseUrl, marca);
  }

  update(marca: Marca): Observable<Marca> {
    return this.httpClient.put<any>(`${this.baseUrl}/${marca.id}`, Marca); 
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`); 
  }

}
