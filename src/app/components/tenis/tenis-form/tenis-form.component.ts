import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TenisService } from '../../../services/tenis.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';
import { Tenis } from '../../../models/tenis.model';

@Component({
  selector: 'app-tenis-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    NgIf,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    RouterModule,
    MatSelectModule,
  ],
  templateUrl: './tenis-form.component.html',
  styleUrl: './tenis-form.component.css',
})
export class TenisFormComponent {
  formGroup: FormGroup;
  marcas: Marca[] = [];
  apiResponse: any = null;
  fileName: string = '';
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private tenisService: TenisService,
    private marcaService: MarcaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      descricao: [null],
      marca: [null],
      modelo: [null],
      preco: [null],
    });
  }

  ngOnInit(): void {
    this.marcaService.findAll(0, 16).subscribe((data) => {
      this.marcas = data;
      this.initializeForm();
    });
  }

  initializeForm(): void {
    const tenis: Tenis = this.activatedRoute.snapshot.data['tenis'];

    const marca = this.marcas.find(
      (marca) => marca.id === (tenis?.marca?.id || null)
    );

    this.formGroup = this.formBuilder.group({
      id: [tenis && tenis.id ? tenis.id : null],
      nome: [tenis && tenis.marca ? tenis.marca : null, Validators.required],
      marca: [marca],
    });
  }
}
