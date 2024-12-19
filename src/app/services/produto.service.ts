import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Produto } from '../models/produto.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/produtos';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private checkAdminAuthorization(): Observable<never> | null {
    const usuario = this.authService.usuarioAtual;
    if (!usuario || usuario.tipoUsuario !== 'ADMINISTRADOR') {
      console.log('Tentativa de acesso não autorizado');
      return throwError(
        () => new Error('Usuário não tem permissão de administrador')
      );
    }
    return null;
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro ao processar a requisição';

    if (error.status === 401) {
      this.authService.removeToken();
      this.authService.removeUsuarioLogado();
      this.router.navigate(['/login']);
      errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
    } else if (error.status === 403) {
      errorMessage =
        'Acesso negado. Você não tem permissão para realizar esta operação.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Erro do servidor: ${error.status}`;
    }

    console.error('Erro na operação:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  findAll(page?: number, pageSize?: number): Observable<Produto[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }
    return this.httpClient
      .get<Produto[]>(this.baseUrl, { params })
      .pipe(catchError(this.handleError));
  }

  count(): Observable<number> {
    return this.httpClient
      .get<number>(`${this.baseUrl}/count`)
      .pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<Produto> {
    return this.httpClient
      .get<Produto>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  findByNome(
    nome: string,
    page?: number,
    pageSize?: number
  ): Observable<Produto[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }
    return this.httpClient
      .get<Produto[]>(`${this.baseUrl}/search/nome/${nome}`, { params })
      .pipe(catchError(this.handleError));
  }

  insert(produto: Produto): Observable<Produto> {
    const authError = this.checkAdminAuthorization();
    if (authError) return authError;

    return this.httpClient
      .post<Produto>(this.baseUrl, produto)
      .pipe(catchError(this.handleError));
  }

  update(produto: Produto): Observable<Produto> {
    const authError = this.checkAdminAuthorization();
    if (authError) return authError;

    return this.httpClient
      .put<Produto>(`${this.baseUrl}/${produto.id}`, produto)
      .pipe(catchError(this.handleError));
  }

  delete(produto: Produto): Observable<void> {
    const authError = this.checkAdminAuthorization();
    if (authError) return authError;

    return this.httpClient
      .delete<void>(`${this.baseUrl}/${produto.id}`)
      .pipe(catchError(this.handleError));
  }
}
