import { Routes } from '@angular/router';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';
import { TenisFormComponent } from './components/tenis/tenis-form/tenis-form.component';
import { MarcaFormComponent } from './components/marca/marca-form/marca-form.component';
import { MarcaListComponent } from './components/marca/marca-list/marca-list.component';


export const routes: Routes = [
    {path: 'tenis', component: TenisListComponent, title: 'Lista de Tenis'},
    {path: 'tenis/new', component: TenisFormComponent, title: 'Novo Tenis'},
    {path: 'marca', component: MarcaListComponent, title: 'Lista de Marca'},
    {path: 'marca/new', component: MarcaFormComponent, title: 'Nova Marca'}
];
