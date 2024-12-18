import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { LocalStorageService } from './local-storage.service';

interface AuthResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private readonly tokenKey = 'jwt_token';
  private readonly usuarioLogadoKey = 'usuario_logado';
  private readonly usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(
    null
  );
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private jwtHelper: JwtHelperService
  ) {
    this.initAuth();
  }

  private initAuth(): void {
    const token = this.getToken();
    const usuario = this.getUsuarioFromStorage();

    if (token && usuario && !this.isTokenExpired()) {
      this.usuarioLogadoSubject.next(usuario);
      this.isLoggedInSubject.next(true);
    } else {
      this.logout();
    }
  }

  login(
    username: string,
    senha: string,
    perfil: number = 2
  ): Observable<Usuario> {
    return this.http
      .post<AuthResponse>(
        `${this.baseUrl}`,
        { login: username, senha, perfil },
        { observe: 'response' }
      )
      .pipe(
        map((response) => {
          const token = response.headers.get('Authorization');
          const usuario = response.body?.usuario;

          if (!token || !usuario) {
            throw new Error('Resposta inválida do servidor');
          }

          this.setToken(token);
          this.setUsuarioLogado(usuario);
          this.isLoggedInSubject.next(true);

          return usuario;
        }),
        catchError(this.handleError)
      );
  }

  loginAdmin(login: string, senha: string): Observable<Usuario> {
    return this.login(login, senha, 1);
  }

  logout(): void {
    this.localStorage.removeItem(this.tokenKey);
    this.localStorage.removeItem(this.usuarioLogadoKey);
    this.usuarioLogadoSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getUsuarioLogado(): Observable<Usuario | null> {
    return this.usuarioLogadoSubject.asObservable();
  }

  hasRole(role: string): boolean {
    const usuario = this.usuarioLogadoSubject.value;
    return usuario?.tipoUsuario === role;
  }

  isAdmin(): boolean {
    const usuario = this.usuarioLogadoSubject.value;
    console.log('AuthService isAdmin check:', {
      usuario,
      tipoUsuario: usuario?.tipoUsuario,
      isAdmin: usuario?.tipoUsuario === 'ADMINISTRADOR',
    });
    return usuario?.tipoUsuario === 'ADMINISTRADOR';
  }

  private getUsuarioFromStorage(): Usuario | null {
    return this.localStorage.getItem(this.usuarioLogadoKey);
  }

  private setToken(token: string): void {
    this.localStorage.setItem(this.tokenKey, token);
  }

  private setUsuarioLogado(usuario: Usuario): void {
    this.localStorage.setItem(this.usuarioLogadoKey, usuario);
    this.usuarioLogadoSubject.next(usuario);
  }

  getToken(): string | null {
    return this.localStorage.getItem(this.tokenKey);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch {
      return true;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro na autenticação';

    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Usuário ou senha inválidos';
    } else if (error.status === 403) {
      errorMessage = 'Acesso não autorizado';
    }

    return throwError(() => new Error(errorMessage));
  }
}
