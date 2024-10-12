import { NgIfContext } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
})
export class UsuarioListComponent {
  tableColumns: string[] = [
    'id-column',
    'nome-column',
    'login-column',
    'telefone-column',
    'endereco-column',
    'perfil-column',
    'acoes-column',
  ];
  usuarios: Usuario[] = [];
  totalRegistros = 0;
  pageSize = 2;
  page = 0;
  filtro: string = '';
  empty: TemplateRef<NgIfContext<any>> | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    if (this.filtro) {
      this.usuarioService
        .findByNome(this.filtro, this.page, this.pageSize)
        .subscribe((data) => {
          this.usuarios = data;
        });
    } else {
      this.usuarioService
        .findAll(this.page, this.pageSize)
        .subscribe((data) => {
          this.usuarios = data;
        });
    }
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarUsuarios();
  }

  aplicarFiltro() {
    this.carregarUsuarios();
  }

  excluirUsuario(usuario: Usuario): void {
    if (confirm(`Deseja realmente excluir o usuario ${usuario.nome}?`)) {
      this.usuarioService.delete(usuario).subscribe({
        next: () => {
          console.log('Usuario excluído com sucesso');
          this.carregarUsuarios();
        },
        error: (err) => {
          console.log('Erro ao excluir usuario: ' + JSON.stringify(err));
        },
      });
    }
  }
}
