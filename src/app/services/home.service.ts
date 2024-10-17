import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Home } from '../models/home.model';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private baseUrl = 'http://localhost:8080/home';

  constructor(private httpClient: HttpClient) {}

  getHomeData(): Observable<Home> {
    return this.httpClient.get<Home>(this.baseUrl);
  }

  getDestaques(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(`${this.baseUrl}/destaques`);
  }
}