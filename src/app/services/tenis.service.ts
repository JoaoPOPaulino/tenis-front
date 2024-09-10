import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';

@Injectable({
  providedIn: 'root'
})
export class TenisService {
  private baseUrl = 'http://localhost:8080/tenis';

  constructor(private HttpClient: HttpClient) { }

  getTenis(): Observable<Tenis[]>{
    return this.HttpClient.get<Tenis[]>(this.baseUrl)
  }

  salvar(tenis: Tenis): Observable<Tenis> {
    return this.HttpClient.post<Tenis>(this.baseUrl, tenis);
  }
}
