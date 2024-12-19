import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TenisService } from '../../../services/tenis.service';
import { MarcaService } from '../../../services/marca.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tenis } from '../../../models/tenis.model';
import { Marca } from '../../../models/marca.model';
import { Tamanho } from '../../../models/tamanho.enum';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Location, NgFor, NgIf } from '@angular/common';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tenis-form',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatProgressBarModule,
    RouterModule,
  ],
  templateUrl: './tenis-form.component.html',
  styleUrls: ['./tenis-form.component.css'],
})
export class TenisFormComponent implements OnInit {
  formGroup: FormGroup;
  marcas: Marca[] = [];
  tamanhos = Object.values(Tamanho);
  fornecedores: Fornecedor[] = [];

  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private tenisService: TenisService,
    private marcaService: MarcaService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private location: Location
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      preco: ['', Validators.required],
      estoque: ['', Validators.required],
      fornecedor: [null, Validators.required],
      descricao: ['', Validators.required],
      marca: [null, Validators.required],
      modelo: ['', Validators.required],
      tamanho: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.marcaService.findAll().subscribe((data) => {
      this.marcas = data;
      this.fornecedorService.findAll().subscribe((data) => {
        this.fornecedores = data;
        this.initializeForm();
      });
    });
  }

  voltarPagina() {
    this.location.back();
  }

  initializeForm() {
    const tenis: Tenis = this.activatedRoute.snapshot.data['tenis'];

    if (tenis) {
      // encontrando a referência da marca no vetor
      const marca = this.marcas.find(
        (m) => m.id === (tenis?.marca?.id || null)
      );
      const fornecedor = this.fornecedores.find(
        (f) => f.id === (tenis?.fornecedor?.id || null)
      );

      this.formGroup = this.formBuilder.group({
        id: [tenis.id],
        modelo: [tenis.modelo, Validators.required],
        preco: [tenis.preco, Validators.required],
        estoque: [tenis.estoque, Validators.required],
        fornecedor: [fornecedor, Validators.required],
        descricao: [tenis.descricao, Validators.required],
        marca: [marca, Validators.required],
        tamanho: [tenis.tamanho, Validators.required],
      });

      if (tenis.imagemUrl) {
        this.imagePreview = this.tenisService.getUrlImage(tenis.imagemUrl);
        this.fileName = tenis.imagemUrl;
      }
    }
  }

  carregarImagemSelecionada(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      // carregando image preview
      const reader = new FileReader();
      reader.onload = (e) => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private uploadImage(tenisId: number) {
    if (this.selectedFile) {
      this.tenisService
        .uploadImage(tenisId, this.selectedFile.name, this.selectedFile)
        .subscribe({
          next: () => {
            this.voltarPagina();
          },
          error: (err) => {
            console.log('Erro ao fazer o upload da imagem');
            this.snackBar.open('Erro ao fazer upload da imagem', 'OK', {
              duration: 3000,
            });
          },
        });
    } else {
      this.voltarPagina();
    }
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      }
    } else if (errorResponse.status < 400) {
      this.snackBar.open(
        errorResponse.error?.message || 'Erro ao salvar tênis',
        'OK',
        {
          duration: 3000,
        }
      );
    } else if (errorResponse.status >= 500) {
      this.snackBar.open('Erro interno do servidor', 'OK', {
        duration: 3000,
      });
    }
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const tenis = this.formGroup.value;

      // selecionando a operacao (insert ou update)
      const operacao =
        tenis.id == null
          ? this.tenisService.insert(tenis)
          : this.tenisService.update(tenis);

      // executando a operacao
      operacao.subscribe({
        next: (tenisCadastrado) => {
          this.uploadImage(tenisCadastrado.id);
        },
        error: (error) => {
          console.log('Erro ao Salvar' + JSON.stringify(error));
          this.tratarErros(error);
        },
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const tenis = this.formGroup.value;
      if (tenis.id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este tênis?',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.tenisService.delete(tenis).subscribe({
              next: () => {
                this.router.navigateByUrl('/tenis');
                this.snackBar.open('Tênis excluído com sucesso!', 'OK', {
                  duration: 3000,
                });
              },
              error: (error) => {
                console.error('Erro ao excluir tênis', error);
                this.snackBar.open('Erro ao excluir tênis', 'OK', {
                  duration: 3000,
                });
              },
            });
          }
        });
      }
    }
  }

  getErrorMessage(
    controlName: string,
    errors: ValidationErrors | null | undefined
  ): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (
        errors.hasOwnProperty(errorName) &&
        this.errorMessages[controlName][errorName]
      ) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    modelo: {
      required: 'O modelo deve ser informado.',
      apiError: ' ',
    },
    descricao: {
      required: 'A descrição deve ser informada.',
      apiError: ' ',
    },
    preco: {
      required: 'O preço deve ser informado.',
      apiError: ' ',
    },
    estoque: {
      required: 'O estoque deve ser informado.',
      apiError: ' ',
    },
    marca: {
      required: 'A marca deve ser informada.',
      apiError: ' ',
    },
    tamanho: {
      required: 'O tamanho deve ser informado.',
      apiError: ' ',
    },
    fornecedor: {
      required: 'O fornecedor deve ser informado.',
      apiError: ' ',
    },
  };
}
