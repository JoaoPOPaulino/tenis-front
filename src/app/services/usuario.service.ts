import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'http://localhost:8080/usuario';

  constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.baseUrl); 
  }

  findById(id: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`); 
  }

  insert(usuario: Usuario): Observable<Usuario> {
    const data = {
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      endereco: usuario.endereco,
      tipoUsuario: usuario.tipoUsuario,
      senha: usuario.senha

    }
    return this.httpClient.post<Usuario>(this.baseUrl, data);
  }

  update(usuario: Usuario): Observable<Tenis> {
    const data = {
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      endereco: usuario.endereco,
      tipoUsuario: usuario.tipoUsuario,
      senha: usuario.senha
    }
    return this.httpClient.put<any>(`${this.baseUrl}/${usuario.id}`, data); 
  }

  delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${id}`); 
  }
}
