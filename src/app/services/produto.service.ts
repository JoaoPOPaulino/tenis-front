import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Produto } from '../models/produto.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/produtos';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  findAll(page?: number, pageSize?: number): Observable<Produto[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }
    return this.httpClient.get<Produto[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<Produto> {
    return this.httpClient.get<Produto>(`${this.baseUrl}/${id}`);
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
    return this.httpClient.get<Produto[]>(
      `${this.baseUrl}/search/nome/${nome}`,
      { params }
    );
  }

  insert(produto: Produto): Observable<Produto> {
    if (!this.authService.isAdmin()) {
      return throwError('Não autorizado');
    }
    return this.httpClient.post<Produto>(this.baseUrl, produto).pipe(
      catchError((error) => {
        console.error('Erro ao inserir produto', error);
        return throwError(error);
      })
    );
  }

  update(produto: Produto): Observable<Produto> {
    if (!this.authService.isAdmin()) {
      return throwError('Não autorizado');
    }
    return this.httpClient
      .put<Produto>(`${this.baseUrl}/${produto.id}`, produto)
      .pipe(
        catchError((error) => {
          console.error('Erro ao atualizar produto', error);
          return throwError(error);
        })
      );
  }

  delete(produto: Produto): Observable<void> {
    if (!this.authService.isAdmin()) {
      return throwError('Não autorizado');
    }
    return this.httpClient.delete<void>(`${this.baseUrl}/${produto.id}`).pipe(
      catchError((error) => {
        console.error('Erro ao excluir produto', error);
        return throwError(error);
      })
    );
  }
}
