import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/usuarios';

  constructor(private httpClient: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.baseUrl);
  }
}
