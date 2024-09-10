import { Component, OnInit } from '@angular/core';
import { Tenis } from '../../../models/tenis.model';
import { TenisService } from '../../../services/tenis.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tenis-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tenis-list.component.html',
  styleUrl: './tenis-list.component.css'
})
export class TenisListComponent implements OnInit{
  tenis: Tenis[] = [];

  constructor(private tenisService: TenisService){

  }

  ngOnInit(): void {
      this.tenisService.getTenis().subscribe(
        data => {this.tenis = data}
      );
  }
}
