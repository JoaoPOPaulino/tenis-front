import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { ProdutoListComponent } from './components/produto/produto-list/produto-list.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';
import { HomeComponent } from './components/home/home.component';
import { ProdutoFormComponent } from './components/produto/produto-form/produto-form.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { LoginComponent } from './components/login/login/login.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';

export const routes: Routes = [
  {
    path: '',
    component: UserTemplateComponent,
    title: 'e-commerce',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'ecommerce' },
      {
        path: 'ecommerce',
        component: TenisListComponent,
        title: 'Lista de Tenis',
      },
    ],
  },

  {
    path: 'admin',
    component: AdminTemplateComponent,
    title: 'Administração',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tenis' },

      { path: 'login', component: LoginComponent, title: 'Login' },
    ],
  },

  // { path: '', component: HomeComponent, title: 'Página Inicial' },
  // { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados' },
  // { path: 'produtos', component: ProdutoListComponent, title: 'Lista de Produtos' },
  // { path: 'produto/:id', component: ProdutoFormComponent, title: 'Detalhes do Produto' },
  // { path: 'produto/novo', component: ProdutoFormComponent, title: 'Novo Produto' },
  // { path: 'usuarios', component: UsuarioListComponent, title: 'Lista de Usuários' },
  // { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de Fornecedores' },
  // { path: 'marcas', component: MarcaListComponent, title: 'Lista de Marcas' },
  // { path: 'tenis', component: TenisListComponent, title: 'Lista de Tênis' },
  // { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
