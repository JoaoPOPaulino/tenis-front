import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';
import { LoginComponent } from './components/login/login.component';

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
