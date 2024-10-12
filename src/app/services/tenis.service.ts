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

  getTenis(): Observable<Tenis[]> {
    return this.httpClient.get<Tenis[]>(this.baseUrl);
  }
}
