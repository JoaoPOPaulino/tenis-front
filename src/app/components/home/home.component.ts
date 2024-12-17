import { Component, OnInit } from '@angular/core';
import { Home } from '../../models/home.model';
import { HomeService } from '../../services/home.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
  ],
})
export class HomeComponent implements OnInit {
  home: Home | undefined;
  currentYear: number = new Date().getFullYear();
  isLoading = true;
  error: string | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData(): void {
    this.isLoading = true;
    this.error = null;

    this.homeService.getHomeData().subscribe({
      next: (data) => {
        this.home = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.error = 'Erro ao carregar dados da página inicial';
        this.isLoading = false;
      },
    });
  }
}
