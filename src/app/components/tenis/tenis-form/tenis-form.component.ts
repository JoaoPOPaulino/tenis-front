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
    NgIf,
    NgFor,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    RouterModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './tenis-form.component.html',
})
export class TenisFormComponent implements OnInit {
  formGroup: FormGroup;
  marcas: Marca[] = [];
  tamanhos: Tamanho[] = [];
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
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', Validators.required],
      estoque: ['', Validators.required],
      marca: [null, Validators.required],
      modelo: ['', Validators.required],
      tamanho: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Carregar marcas e tamanhos disponíveis
    this.tenisService.findMarcas().subscribe((data) => {
      this.marcas = data;
      this.initializeForm();
    });

    this.tenisService.findTamanhos().subscribe((data) => {
      this.tamanhos = data;
    });
  }

  initializeForm(): void {
    const tenis: Tenis = this.route.snapshot.data['tenis'];
    if (tenis && tenis.nomeImagem) {
      this.imagePreview = this.tenisService.getUrlImage(tenis.nomeImagem);
      this.fileName = tenis.nomeImagem;
    }

    const marca = this.marcas.find((m) => m.id === (tenis?.marca?.id || null));

    this.formGroup.patchValue({
      id: tenis?.id || null,
      nome: tenis?.nome || null,
      descricao: tenis?.descricao || null,
      preco: tenis?.preco || null,
      estoque: tenis?.estoque || null,
      marca: marca || null,
      modelo: tenis?.modelo || null,
      tamanho: tenis?.tamanho || null,
    });
  }

  carregarImagemSelecionada(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      const reader = new FileReader();
      reader.onload = (e) => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  salvar() {
    if (this.formGroup.valid) {
      const tenis = this.formGroup.value;
      const operacao =
        tenis.id == null
          ? this.tenisService.insert(tenis)
          : this.tenisService.update(tenis);

      operacao.subscribe({
        next: (tenisSalvo) => {
          this.uploadImage(tenisSalvo.id);
        },
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        },
      });
    }
  }
}
