import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { EstadoService } from '../../../services/estado.service';
import { Estado } from '../../../models/estado.model';

@Component({
  selector: 'app-estado-list',
  standalone: true, // Mudamos para true
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './estado-list.component.html',
  styleUrls: ['./estado-list.component.css'], // Corrigido o nome para "styleUrls"
})
export class EstadoListComponent implements OnInit {
  estados: Estado[] = []; // Define a lista de estados como um array do modelo Estado
  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acoes']; // Colunas da tabela

  // Injetando o serviço de estados
  constructor(private estadoService: EstadoService) {}

  ngOnInit(): void {
    this.carregarEstados(); // Chama o método para carregar os estados ao iniciar o componente
  }

  carregarEstados(): void {
    // Exemplo: usando paginação, passando a página e o tamanho da página
    this.estadoService.findAll(0, 10).subscribe({
      next: (data: Estado[]) => {
        this.estados = data; // Atribui os dados recebidos à variável estados
      },
      error: (err) => {
        console.error('Erro ao carregar estados', err); // Tratamento de erro
      },
    });
  }

  // Você pode também adicionar métodos para deletar, editar etc. dependendo da sua necessidade
}
