import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient} from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { ProdutoListComponent } from './components/produto/produto-list/produto-list.component';
import { ProdutoFormComponent } from './components/produto/produto-form/produto-form.component';
import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EstadoListComponent,
    ProdutoListComponent,
    ProdutoFormComponent,
    UsuarioListComponent,
    FornecedorListComponent,
    MarcaListComponent,
    TenisListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient() // Substitui o HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }