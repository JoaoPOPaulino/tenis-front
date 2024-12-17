import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenav,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatList, MatListItem, MatNavList } from '@angular/material/list';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenav,
    MatDrawer,
    MatDrawerContainer,
    RouterModule,
    MatDrawerContent,
    MatToolbar,
    MatList,
    MatNavList,
    MatListItem,
    RouterOutlet,
    MatIcon,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  menuItems = [
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/produtos', icon: 'inventory_2', label: 'Produtos' },
    { path: '/admin/fornecedores', icon: 'business', label: 'Fornecedores' },
    { path: '/admin/usuarios', icon: 'people', label: 'Usuários' },
    { path: '/admin/avaliacoes', icon: 'star', label: 'Avaliações' },
  ];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.sideNavToggleSubject.subscribe(() => {
      this.drawer.toggle();
    });
  }
}
