import { Routes } from '@angular/router';
import { TenisListComponent } from './components/tenis/tenis-list/tenis-list.component';
import { TenisFormComponent } from './component/tenis/tenis/tenis-form/tenis-form.component';

export const routes: Routes = [
    {path: 'tenis', component: TenisListComponent, title: 'Lista de Tenis'},
    {path: 'tenis/new', component: TenisFormComponent, title: 'Novo Tenis'}
];
