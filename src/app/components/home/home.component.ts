import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  products = [
    { id: 1, name: 'Tênis de Corrida Ultra Leve', price: 299.99, image: 'https://example.com/tenis-corrida.jpg' },
    { id: 2, name: 'Tênis Casual Urbano', price: 199.99, image: 'https://example.com/tenis-casual.jpg' },
    { id: 3, name: 'Tênis Esportivo Pro', price: 349.99, image: 'https://example.com/tenis-esportivo.jpg' },
    { id: 4, name: 'Tênis Skatista Street', price: 249.99, image: 'https://example.com/tenis-skatista.jpg' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}