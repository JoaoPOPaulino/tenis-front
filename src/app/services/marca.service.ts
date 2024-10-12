import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  private baseUrl = 'http://localhost:8080/marcas';

  constructor(private httpClient: HttpClient) {}

  getMarcas(): Observable<Marca[]> {
    return this.httpClient.get<Marca[]>(this.baseUrl);
  }
}
