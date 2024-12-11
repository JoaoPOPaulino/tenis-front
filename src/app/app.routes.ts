import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';
import { LoginComponent } from './components/login/login.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { TenisFormComponent } from './components/tenis/tenis-form/tenis-form.component';
import { tenisResolver } from './components/tenis/resolver/tenis.resolver';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { fornecedorResolver } from './components/fornecedor/resolver/resolver.component';

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
      { path: 'carrinho', component: CarrinhoComponent, title: 'Carrinho' },
    ],
  },

  {
    path: 'admin',
    component: AdminTemplateComponent,
    title: 'Administração',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tenis' },

      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
        canActivate: [],
      },

      { path: 'tenis', component: TenisListComponent, title: 'Lista de Tenis' },
      { path: 'tenis/new', component: TenisFormComponent, title: 'Novo Tenis' },
      {
        path: 'tenis/edit/:id',
        component: TenisFormComponent,
        resolve: { tenis: tenisResolver },
      },

      {
        path: 'fornecedor',
        component: FornecedorListComponent,
        title: 'Lista de Fornecedores',
      },
      {
        path: 'fornecedor/new',
        component: FornecedorFormComponent,
        title: 'Novo Fornecedor',
      },
      {
        path: 'fornecedor/edit/:id',
        component: FornecedorFormComponent,
        resolve: { fornecedor: fornecedorResolver },
      },
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
