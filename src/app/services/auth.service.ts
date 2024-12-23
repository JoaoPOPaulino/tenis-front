import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private tokenKey = 'jwt_token';
  private usuarioLogadoKey = 'usuario_logado';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService
  ) {
    this.initUsuarioLogado();
  }

  private initUsuarioLogado(): void {
    const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
    if (usuario) {
      this.usuarioLogadoSubject.next(usuario);
    }
  }

  public loginADM(username: string, senha: string): Observable<any> {
    const params = {
      login: username,
      senha: senha,
      perfil: 1, // ADM
    };
    return this.httpClient
      .post(`${this.baseUrl}`, params, { observe: 'response' })
      .pipe(
        tap((res: any) => {
          const authToken = res.headers.get('Authorization') ?? '';
          if (authToken) {
            this.setToken(authToken);
            const usuarioLogado = res.body;
            //console.log(usuarioLogado);
            if (usuarioLogado) {
              this.setUsuarioLogado(usuarioLogado);
              this.usuarioLogadoSubject.next(usuarioLogado);
            }
          }
        })
      );
  }

  public loginUser(username: string, senha: string): Observable<any> {
    const params = {
      login: username,
      senha: senha,
      perfil: 2, // Usuário Comum
    };
    return this.httpClient
      .post(`${this.baseUrl}`, params, { observe: 'response' })
      .pipe(
        tap((res: any) => {
          const authToken = res.headers.get('Authorization') ?? '';
          if (authToken) {
            this.setToken(authToken);
            const usuarioLogado = res.body;
            if (usuarioLogado) {
              this.setUsuarioLogado(usuarioLogado);
              this.usuarioLogadoSubject.next(usuarioLogado);
            }
          }
        })
      );
  }

  getCurrentUser(): Usuario | null {
    return this.usuarioLogadoSubject.value;
  }

  isAdmin(): boolean {
    const usuario = this.getCurrentUser();
    return usuario?.tipoUsuario === 'ADMINISTRADOR';
  }

  setUsuarioLogado(usuario: Usuario): void {
    this.localStorageService.setItem(this.usuarioLogadoKey, usuario);
  }

  setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.asObservable();
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  removeUsuarioLogado(): void {
    this.localStorageService.removeItem(this.usuarioLogadoKey);
    this.usuarioLogadoSubject.next(null);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Token invalido', error);
      return true;
    }
  }

  logout(): void {
    // Remove o token
    this.removeToken();
    // Remove o usuário logado
    this.removeUsuarioLogado();
    // Limpa o BehaviorSubject
    this.usuarioLogadoSubject.next(null);
  }

  get usuarioAtual(): Usuario | null {
    return this.usuarioLogadoSubject.value;
  }
}
