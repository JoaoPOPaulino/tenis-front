import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagamento } from '../models/pagamento.model';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  private apiUrl = 'https://api.exemplo.com/pagamento'; // URL da API de pagamento

  constructor(private http: HttpClient) {}

  processarPagamento(dadosPagamento: Pagamento): Observable<any> {
    return this.http.post<any>(this.apiUrl, dadosPagamento);
  }
}
