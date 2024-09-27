import { Component, OnInit } from '@angular/core';
import { Tenis } from '../../../models/tenis.model';
import { TenisService } from '../../../services/tenis.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tenis-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './tenis-list.component.html',
  styleUrl: './tenis-list.component.css'
})
export class TenisListComponent implements OnInit{
  tenis: Tenis[] = [];
  displayedColumns: string[]= ['id', 'nome', 'tamanho', 'marca', 'acao']

  constructor(private tenisService: TenisService){

  }

  ngOnInit(): void {
      this.tenisService.findAll().subscribe(
        data => {this.tenis = data}
      );
  }
}
