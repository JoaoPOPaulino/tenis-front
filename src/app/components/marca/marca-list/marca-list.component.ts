import { Component, OnInit } from '@angular/core';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-marca-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './marca-list.component.html',
  styleUrls: ['./marca-list.component.css'],
})
export class MarcaListComponent implements OnInit {
  marcas: Marca[] = [];

  constructor(private marcaService: MarcaService) {}

  ngOnInit(): void {
    this.marcaService.getMarcas().subscribe((data) => {
      this.marcas = data;
    });
  }
}
