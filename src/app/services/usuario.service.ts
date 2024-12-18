import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/usuarios';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Usuario[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }

    return this.httpClient.get<Usuario[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findByNome(
    nome: string,
    page?: number,
    pageSize?: number
  ): Observable<Usuario[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }
    return this.httpClient.get<Usuario[]>(
      `${this.baseUrl}/search/nome/${nome}`,
      { params }
    );
  }

  findById(id: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  insert(usuario: Usuario): Observable<Usuario> {
    const data = {
      nome: usuario.nome,
      email: usuario.email,
      login: usuario.login,
      senha: usuario.senha,
      tipoUsuario: usuario.tipoUsuario,
      telefones: usuario.telefones.map((tel) => ({
        ddd: tel.ddd,
        numero: tel.numero,
      })),
      enderecos: usuario.enderecos.map((end) => ({
        cidade: {
          id: end.cidade.id,
          nome: end.cidade.nome,
          estado: {
            id: end.cidade.estado.id,
            nome: end.cidade.estado.nome,
            sigla: end.cidade.estado.sigla,
          },
        },
        cep: end.cep,
        quadra: end.quadra,
        rua: end.rua,
        numero: end.numero,
        complemento: end.complemento,
        principal: end.principal,
        ativo: end.ativo,
      })),
      cartoes: usuario.cartoes.map((cartao) => ({
        tipoCartao: cartao.tipoCartao,
        numero: cartao.numero,
        cvv: cartao.cvv,
        validade: cartao.validade,
        titular: cartao.titular,
        cpf: cartao.cpf,
        ativo: cartao.ativo,
      })),
    };
    return this.httpClient.post<Usuario>(this.baseUrl, data);
  }

  update(usuario: Usuario): Observable<Usuario> {
    const data = {
      nome: usuario.nome,
      email: usuario.email,
      login: usuario.login,
      senha: usuario.senha,
      tipoUsuario: usuario.tipoUsuario,
      telefones: usuario.telefones.map((tel) => ({
        ddd: tel.ddd,
        numero: tel.numero,
      })),
      enderecos: usuario.enderecos.map((end) => ({
        cidade: {
          id: end.cidade.id,
          nome: end.cidade.nome,
          estado: {
            id: end.cidade.estado.id,
            nome: end.cidade.estado.nome,
            sigla: end.cidade.estado.sigla,
          },
        },
        cep: end.cep,
        quadra: end.quadra,
        rua: end.rua,
        numero: end.numero,
        complemento: end.complemento,
        principal: end.principal,
        ativo: end.ativo,
      })),
      cartoes: usuario.cartoes.map((cartao) => ({
        tipoCartao: cartao.tipoCartao,
        numero: cartao.numero,
        cvv: cartao.cvv,
        validade: cartao.validade,
        titular: cartao.titular,
        cpf: cartao.cpf,
        ativo: cartao.ativo,
      })),
    };
    return this.httpClient.put<Usuario>(`${this.baseUrl}/${usuario.id}`, data);
  }

  delete(usuario: Usuario): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${usuario.id}`);
  }

  alterarSenha(email: string, novaSenha: string): Observable<any> {
    const data = {
      email: email,
      novaSenha: novaSenha,
    };
    return this.httpClient.post<any>(`${this.baseUrl}/alterar-senha`, data);
  }

  enviarEmailRecuperacao(email: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/recuperar-senha`, {
      email,
    });
  }

  verificarToken(token: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/verificar-token/${token}`);
  }

  redefinirSenha(token: string, novaSenha: string): Observable<any> {
    const data = {
      token: token,
      novaSenha: novaSenha,
    };
    return this.httpClient.post<any>(`${this.baseUrl}/redefinir-senha`, data);
  }

  alterarSenhaLogado(senhaAtual: string, novaSenha: string): Observable<any> {
    const data = {
      senhaAtual: senhaAtual,
      novaSenha: novaSenha,
    };
    return this.httpClient.post<any>(
      `${this.baseUrl}/alterar-senha-logado`,
      data
    );
  }

  alterarLogin(
    loginAtual: string,
    novoLogin: string,
    senha: string
  ): Observable<any> {
    const data = {
      loginAtual,
      novoLogin,
      senha,
    };
    return this.httpClient.post<any>(`${this.baseUrl}/alterar-login`, data);
  }

  getUsuarioLogado(): Observable<Usuario> {
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      throw new Error('Usuário não está logado');
    }

    return this.httpClient.get<Usuario>(`${this.baseUrl}/${usuarioId}`);
  }
}
