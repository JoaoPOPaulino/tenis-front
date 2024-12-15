import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/fornecedor.model';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private baseUrl = 'http://localhost:8080/fornecedores';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Fornecedor[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }

    return this.httpClient.get<Fornecedor[]>(this.baseUrl, { params });
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
  ): Observable<Fornecedor[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }
    return this.httpClient.get<Fornecedor[]>(
      `${this.baseUrl}/search/nome/${nome}`,
      { params }
    );
  }

  findById(id: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.baseUrl}/${id}`);
  }

  insert(fornecedor: Fornecedor): Observable<Fornecedor> {
    const data = {
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      endereco: {
        cidade: {
          id: fornecedor.endereco.cidade.id,
          nome: fornecedor.endereco.cidade.nome,
          estado: {
            id: fornecedor.endereco.cidade.estado.id,
            nome: fornecedor.endereco.cidade.estado.nome,
            sigla: fornecedor.endereco.cidade.estado.sigla,
          },
        },
        cep: fornecedor.endereco.cep,
        quadra: fornecedor.endereco.quadra,
        rua: fornecedor.endereco.rua,
        numero: fornecedor.endereco.numero,
        complemento: fornecedor.endereco.complemento,
        principal: fornecedor.endereco.principal,
        ativo: fornecedor.endereco.ativo,
      },
    };
    return this.httpClient.post<Fornecedor>(this.baseUrl, data);
  }

  update(fornecedor: Fornecedor): Observable<Fornecedor> {
    const data = {
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      endereco: {
        cidade: {
          id: fornecedor.endereco.cidade.id,
          nome: fornecedor.endereco.cidade.nome,
          estado: {
            id: fornecedor.endereco.cidade.estado.id,
            nome: fornecedor.endereco.cidade.estado.nome,
            sigla: fornecedor.endereco.cidade.estado.sigla,
          },
        },
        cep: fornecedor.endereco.cep,
        quadra: fornecedor.endereco.quadra,
        rua: fornecedor.endereco.rua,
        numero: fornecedor.endereco.numero,
        complemento: fornecedor.endereco.complemento,
        principal: fornecedor.endereco.principal,
        ativo: fornecedor.endereco.ativo,
      },
    };
    return this.httpClient.put<Fornecedor>(
      `${this.baseUrl}/${fornecedor.id}`,
      data
    );
  }

  delete(fornecedor: Fornecedor): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${fornecedor.id}`);
  }
}
