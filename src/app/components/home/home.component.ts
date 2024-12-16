import { Component, OnInit } from '@angular/core';
import { Home } from '../../models/home.model';
import { HomeService } from '../../services/home.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  home: Home | undefined;
  currentYear: number = new Date().getFullYear();

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getHomeData();
  }

  getHomeData(): void {
    this.homeService.getHomeData().subscribe(
      (data: Home) => {
        this.home = data;
      },
      (error: any) => {
        console.error('Erro ao obter os dados da página inicial:', error);
      }
    );
  }
}
