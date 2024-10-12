import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tenis } from '../models/tenis.model';
import { Usuario } from '../models/usuario.model';
import { Endereco } from '../models/endereco.model';
import { Cartao } from '../models/cartao.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/usuario';

  constructor(private httpClient: HttpClient) {}

  findAll(page: number, pageSize: number): Observable<Usuario[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Usuario[]>(`${this.baseUrl}`, { params });
  }

  findById(id: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  create(usuario: Usuario): Observable<Usuario> {
    const data = {
      nome: usuario.nome,
      email: usuario.email,
      login: usuario.login,
      senha: usuario.senha,
      idPerfil: usuario.tipoUsuario.id,
    };
    return this.httpClient.post<Usuario>(`${this.baseUrl}`, data);
  }

  update(usuario: Usuario): Observable<Tenis> {
    const data = {
      nome: usuario.nome,
      email: usuario.email,
      login: usuario.login,
      senha: usuario.senha,
      idPerfil: usuario.tipoUsuario.id,
    };
    return this.httpClient.put<any>(`${this.baseUrl}/${usuario.id}`, data);
  }

  delete(usuario: Usuario): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${usuario.id}`);
  }

  findByNome(
    nome: string,
    page: number,
    pageSize: number
  ): Observable<Usuario[]> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.httpClient.get<Usuario[]>(`${this.baseUrl}/search/${nome}`, {
      params,
    });
  }

  createEnderecos(
    usuarioId: number,
    enderecos: Endereco[]
  ): Observable<Endereco[]> {
    const object = enderecos.map((endereco) => ({
      cep: endereco.cep,
      quadra: endereco.quadra,
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento,
      cidade: endereco.cidade,
    }));

    return this.httpClient.post<Endereco[]>(
      `${this.baseUrl}/${usuarioId}/enderecos`,
      object
    );
  }

  updateEnderecos(
    usuarioId: number,
    enderecoId: number,
    endereco: Endereco
  ): Observable<Endereco[]> {
    const object = {
      cep: endereco.cep,
      quadra: endereco.quadra,
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento,
      cidade: endereco.cidade,
    };

    return this.httpClient.put<Endereco[]>(
      `${this.baseUrl}/${usuarioId}/enderecos/${enderecoId}`,
      object
    );
  }

  deletarEndereco(usuarioId: number, enderecoId: number): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}/${usuarioId}/enderecos/${enderecoId}`
    );
  }

  createCartao(usuarioId: number, cartao: Cartao[]): Observable<Cartao[]> {
    const object = cartao.map((cartao) => ({
      idTipo: cartao.tipo.id,
      numero: cartao.numero,
      cvv: cartao.cvv,
      validade: cartao.validade,
      titular: cartao.titular,
      cpf: cartao.cpf,
    }));

    return this.httpClient.post<Cartao[]>(
      `${this.baseUrl}/${usuarioId}/cartoes`,
      object
    );
  }

  findCartaoByUsuarioId(
    usuarioId: number,
    cartaoId: number
  ): Observable<Cartao> {
    return this.httpClient.get<Cartao>(
      `${this.baseUrl}/${usuarioId}/cartoes/${cartaoId}`
    );
  }

  updateCartao(
    usuarioId: number,
    cartaoId: number,
    cartao: Cartao
  ): Observable<Cartao[]> {
    const object = {
      idTipo: cartao.tipo.id,
      numero: cartao.numero,
      cvv: cartao.cvv,
      validade: cartao.validade,
      titular: cartao.titular,
      cpf: cartao.cpf,
    };

    return this.httpClient.put<Cartao[]>(
      `${this.baseUrl}/${usuarioId}/enderecos/${cartaoId}`,
      object
    );
  }

  deletarCartao(usuarioId: number, cartaoId: number): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}/${usuarioId}/cartoes/${cartaoId}`
    );
  }
}
