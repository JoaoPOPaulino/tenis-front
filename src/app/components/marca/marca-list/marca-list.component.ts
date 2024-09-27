import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';

@Component({
  selector: 'app-marca-list',
  standalone: true,
  imports: [NgFor, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, RouterModule],
  templateUrl: './marca-list.component.html',
  styleUrl: './marca-list.component.css'
})
export class MarcaListComponent {
  marcas: Marca [] = [];
  displayedColumns: String[] = ['id', 'nome', 'acao'];

  constructor(private marcaService: MarcaService){

  }

  ngOnInit(): void {
    this.marcaService.findAll().subscribe(
      data => { this.marcas = data}
    );
  }

}
