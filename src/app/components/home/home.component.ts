import { Component, OnInit } from '@angular/core';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [
    {
      id: 'tenis-corrida',
      name: 'Tênis de Corrida Ultra Leve',
      price: 299.99,
      image: 'https://example.com/tenis-corrida.jpg'
    },
    {
      id: 'tenis-casual',
      name: 'Tênis Casual Urbano',
      price: 199.99,
      image: 'https://example.com/tenis-casual.jpg'
    },
    {
      id: 'tenis-esportivo',
      name: 'Tênis Esportivo Pro',
      price: 349.99,
      image: 'https://example.com/tenis-esportivo.jpg'
    },
    {
      id: 'tenis-skatista',
      name: 'Tênis Skatista Street',
      price: 249.99,
      image: 'https://example.com/tenis-skatista.jpg'
    }
  ];

  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }
}