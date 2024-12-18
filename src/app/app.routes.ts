import { Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { TenisFormComponent } from './components/tenis/tenis-form/tenis-form.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { tenisResolver } from './components/tenis/resolver/tenis.resolver';
import { fornecedorResolver } from './components/fornecedor/resolver/resolver.component';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';
import { ProdutoListComponent } from './components/produto/produto-list/produto-list.component';
import { MarcaFormComponent } from './components/marca/marca-form/marca-form.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form.component';
import { ProdutoFormComponent } from './components/produto/produto-form/produto-form.component';
import { usuarioResolver } from './components/usuario/resolver/resolver.component';
import { marcaResolver } from './components/marca/resolver/resolver.component';
import { produtoResolver } from './components/produto/resolver/resolver.component';
import { UserLoginComponent } from './components/login/user-login/user-login.component';
import { AdminLoginComponent } from './components/login/admin-login/admin-login.component';
import { AlterarSenhaComponent } from './components/usuario/alterar-senha/alterar-senha.component';
import { AuthGuard } from './guard/auth.guard';

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
        title: 'Carrinho', // Protege o carrinho para usuários logados
      },
      {
        path: 'login',
        component: UserLoginComponent,
        title: 'Login de Usuário',
      },
      {
        path: 'esqueci-senha',
        component: AlterarSenhaComponent,
        title: 'Alterar Senha',
      },
      {
        path: 'novo-usuario',
        component: UsuarioFormComponent,
        title: 'Novo Usuário',
      },
      {
        path: 'produtos',
        component: ProdutoListComponent,
        title: 'Produtos',
      },
      {
        path: 'marcas',
        component: MarcaListComponent,
        title: 'Marcas',
      },
    ],
  },

  // Rota de login admin (pública)
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    title: 'Login Administrativo',
  },

  // Rota administrativa (protegida por authGuard e adminGuard)
  {
    path: 'admin',
    component: AdminTemplateComponent,
    title: 'Administração',
    canActivate: [AuthGuard], // Protege toda área admin
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

      // Rotas de Marca
      {
        path: 'marcas',
        children: [
          {
            path: '',
            component: MarcaListComponent,
            title: 'Lista de Marcas',
          },
          {
            path: 'new',
            component: MarcaFormComponent,
            title: 'Nova Marca',
          },
          {
            path: 'edit/:id',
            component: MarcaFormComponent,
            title: 'Editar Marca',
            resolve: { marca: marcaResolver },
          },
        ],
      },

      // Rotas de Usuário
      {
        path: 'usuarios',
        children: [
          {
            path: '',
            component: UsuarioListComponent,
            title: 'Lista de Usuários',
          },
          {
            path: 'new',
            component: UsuarioFormComponent,
            title: 'Novo Usuário',
          },
          {
            path: 'edit/:id',
            component: UsuarioFormComponent,
            title: 'Editar Usuário',
            resolve: { usuario: usuarioResolver },
          },
        ],
      },

      // Rotas de Produto
      {
        path: 'produtos',
        children: [
          {
            path: '',
            component: ProdutoListComponent,
            title: 'Lista de Produtos',
          },
          {
            path: 'new',
            component: ProdutoFormComponent,
            title: 'Novo Produto',
          },
          {
            path: 'edit/:id',
            component: ProdutoFormComponent,
            title: 'Editar Produto',
            resolve: { produto: produtoResolver },
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
