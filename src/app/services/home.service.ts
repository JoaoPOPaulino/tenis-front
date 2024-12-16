import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Home } from '../models/home.model';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private baseUrl = 'http://localhost:8080/home';

  constructor(private httpClient: HttpClient) {}

  getHomeData(): Observable<Home> {
    return this.httpClient
      .get<Home>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  getDestaques(): Observable<Produto[]> {
    return this.httpClient
      .get<Produto[]>(`${this.baseUrl}/destaques`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocorreu um erro:', error.error.message);
    } else {
      console.error(
        `Código do erro ${error.status}, ` +
          `Erro: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(
      'Algo deu errado; por favor, tente novamente mais tarde.'
    );
  }
}
