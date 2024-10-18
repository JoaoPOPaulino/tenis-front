import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

// Definindo as rotas
const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    HomeComponent // Certifique-se de ter registrado o seu componente Home
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Necessário para animações do Angular Material
    MatToolbarModule, // Para barra de ferramentas
    MatButtonModule,  // Para botões
    MatCardModule,    // Para cards
    RouterModule.forRoot(routes) // Para configuração das rotas
  ],
  providers: [],
  bootstrap: [HomeComponent] // Defina o componente principal a ser carregado
})
export class AppModule { }
