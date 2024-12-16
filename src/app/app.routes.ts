import { Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';
import { LoginComponent } from './components/login/login.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { TenisFormComponent } from './components/tenis/tenis-form/tenis-form.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { tenisResolver } from './components/tenis/resolver/tenis.resolver';
import { fornecedorResolver } from './components/fornecedor/resolver/resolver.component';
import { authGuard } from './guard/auth.guard';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';
import { ProdutoListComponent } from './components/produto/produto-list/produto-list.component';

export const routes: Routes = [
  // Rota pública (e-commerce)
  {
    path: '',
    component: UserTemplateComponent,
    title: 'e-commerce',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ecommerce',
      },
      {
        path: 'ecommerce',
        component: TenisListComponent,
        title: 'Lista de Tênis',
      },
      {
        path: 'carrinho',
        component: CarrinhoComponent,
        title: 'Carrinho',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
      {
        path: 'produtos',
        component: ProdutoListComponent, // Crie este componente
        title: 'Produtos'
      },
      {
        path: 'marcas',
        component: MarcaListComponent, // Crie este componente
        title: 'Marcas'
      }
    ],
  },

  // Rota administrativa (protegida)
  {
    path: 'admin',
    component: AdminTemplateComponent,
    title: 'Administração',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tenis',
      },

      // Rotas de Tênis
      {
        path: 'tenis',
        children: [
          {
            path: '',
            component: TenisListComponent,
            title: 'Lista de Tênis',
          },
          {
            path: 'new',
            component: TenisFormComponent,
            title: 'Novo Tênis',
          },
          {
            path: 'edit/:id',
            component: TenisFormComponent,
            title: 'Editar Tênis',
            resolve: { tenis: tenisResolver },
          },
        ],
      },

      // Rotas de Fornecedor
      {
        path: 'fornecedor',
        children: [
          {
            path: '',
            component: FornecedorListComponent,
            title: 'Lista de Fornecedores',
          },
          {
            path: 'new',
            component: FornecedorFormComponent,
            title: 'Novo Fornecedor',
          },
          {
            path: 'edit/:id',
            component: FornecedorFormComponent,
            title: 'Editar Fornecedor',
            resolve: { fornecedor: fornecedorResolver },
          },
        ],
      },
    ],
  },

  {
    path: '**',
    redirectTo: '/ecommerce',
  },
];
