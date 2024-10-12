import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { ProdutoListComponent } from './components/produto/produto-list/produto-list.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';

const routes: Routes = [
  {
    path: 'estados',
    component: EstadoListComponent,
    title: 'Lista de Estados',
  },
  {
    path: 'produtos',
    component: ProdutoListComponent,
    title: 'Lista de Produtos',
  },
  {
    path: 'usuarios',
    component: UsuarioListComponent,
    title: 'Lista de Usuários',
  },

  {
    path: 'fornecedores',
    component: FornecedorListComponent,
    title: 'Lista de Fornecedores',
  },
  { path: 'marcas', component: MarcaListComponent, title: 'Lista de Marcas' },
  { path: 'tenis', component: TenisListComponent, title: 'Lista de Tênis' },
  { path: '', redirectTo: '/produtos', pathMatch: 'full' }, // Redirecionar para produtos por padrão
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
