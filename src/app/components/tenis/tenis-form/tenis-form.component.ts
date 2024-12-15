import { Component, OnInit } from '@angular/core';
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
import { NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';
import { Tenis } from '../../../models/tenis.model';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tenis-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule, MatSelectModule, MatIconModule],
  templateUrl: './tenis-form.component.html'
})
export class TenisFormComponent implements OnInit {
  formGroup: FormGroup;
  marcas: Marca[] = [];
  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private tenisService: TenisService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      descricao: ['', Validators.required],
      marca: [null, Validators.required],
      modelo: ['', Validators.required],
      tamanho: [null, Validators.required],
      preco: ['', Validators.required],
      estoque: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tenisService.findMarcas().subscribe(data => {
      this.marcas = data;
      this.initializeForm();
    });
  }

  private initializeForm() {
    const tenis: Tenis = this.route.snapshot.data['tenis'];
    if (tenis) {
      if (tenis.nomeImagem) {
        this.imagePreview = this.tenisService.getUrlImage(tenis.nomeImagem);
        this.fileName = tenis.nomeImagem;
      }
      
      this.formGroup.patchValue({
        id: tenis.id,
        descricao: tenis.descricao,
        marca: tenis.marca,
        modelo: tenis.modelo,
        tamanho: tenis.tamanho,
        preco: tenis.preco,
        estoque: tenis.estoque
      });
    }
  }

  loadSelectedImage(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private uploadImage(tenisId: number) {
    if (this.selectedFile) {
      this.tenisService.uploadImage(tenisId, this.selectedFile.name, this.selectedFile)
        .subscribe({
          next: () => {
            this.location.back();
          },
          error: err => {
            console.log('Erro ao fazer o upload da imagem');
          }
        });
    } else {
      this.location.back();
    }
  }

  salvar() {
    if (this.formGroup.valid) {
      const tenis = this.formGroup.value;
      const operacao = tenis.id ? 
        this.tenisService.update(tenis) : 
        this.tenisService.insert(tenis);

      operacao.subscribe({
        next: (tenisSalvo) => {
          this.uploadImage(tenisSalvo.id);
        },
        error: (error) => {
          console.error('Erro ao salvar', error);
        }
      });
    }
  }

  voltarPagina() {
    this.location.back();
  }

  excluir() {
    if (this.formGroup.valid) {
      const tenis = this.formGroup.value;
      if (tenis.id != null) {
        this.tenisService.delete(tenis).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/tenis');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  getErrorMessage(field: string, errors: any): string {
    if (!errors) {
      return '';
    }

    if (errors.required) {
      return `O campo ${field} é obrigatório`;
    }

    if (errors.apiError) {
      return errors.apiError;
    }

    return 'Campo inválido';
  }
}