import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css'],
})
export class FornecedorListComponent implements OnInit {
  fornecedores: Fornecedor[] = [];

  constructor(private fornecedorService: FornecedorService) {}

  ngOnInit(): void {
    this.fornecedorService.getFornecedores().subscribe((data) => {
      this.fornecedores = data;
    });
  }
}
