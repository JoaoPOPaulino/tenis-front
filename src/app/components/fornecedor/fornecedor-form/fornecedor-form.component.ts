import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fornecedor } from '../../../models/fornecedor.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { EstadoService } from '../../../services/estado.service';
import { CidadeService } from '../../../services/cidade.service';
import { Estado } from '../../../models/estado.model';
import { Cidade } from '../../../models/cidade.model';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.css'],
})
export class FornecedorFormComponent implements OnInit {
  formGroup: FormGroup;
  estados: Estado[] = [];
  cidades: Cidade[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private estadoService: EstadoService,
    private cidadeService: CidadeService
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      cnpj: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(14),
        ]),
      ],
      endereco: this.formBuilder.group({
        cidade: this.formBuilder.group({
          id: [null],
          nome: ['', Validators.required],
          estado: this.formBuilder.group({
            id: [null],
            nome: ['', Validators.required],
            sigla: ['', Validators.required],
          }),
        }),
        cep: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
          ]),
        ],
        quadra: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(10),
          ]),
        ],
        rua: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(60),
          ]),
        ],
        numero: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(10),
          ]),
        ],
        complemento: [
          '',
          Validators.compose([
            Validators.minLength(2),
            Validators.maxLength(60),
          ]),
        ],
        principal: [false],
        ativo: [true],
      }),
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.carregarEstados();
  }

  initializeForm() {
    const fornecedor: Fornecedor =
      this.ActivatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [fornecedor && fornecedor.id ? fornecedor.id : null],
      nome: [
        fornecedor && fornecedor.nome ? fornecedor.nome : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      cnpj: [
        fornecedor && fornecedor.cnpj ? fornecedor.cnpj : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(14),
        ]),
      ],
      endereco: this.formBuilder.group({
        cidade: this.formBuilder.group({
          id: [
            fornecedor && fornecedor.endereco && fornecedor.endereco.cidade
              ? fornecedor.endereco.cidade.id
              : null,
          ],
          nome: [
            fornecedor && fornecedor.endereco && fornecedor.endereco.cidade
              ? fornecedor.endereco.cidade.nome
              : '',
            Validators.required,
          ],
          estado: this.formBuilder.group({
            id: [
              fornecedor &&
              fornecedor.endereco &&
              fornecedor.endereco.cidade &&
              fornecedor.endereco.cidade.estado
                ? fornecedor.endereco.cidade.estado.id
                : null,
            ],
            nome: [
              fornecedor &&
              fornecedor.endereco &&
              fornecedor.endereco.cidade &&
              fornecedor.endereco.cidade.estado
                ? fornecedor.endereco.cidade.estado.nome
                : '',
              Validators.required,
            ],
            sigla: [
              fornecedor &&
              fornecedor.endereco &&
              fornecedor.endereco.cidade &&
              fornecedor.endereco.cidade.estado
                ? fornecedor.endereco.cidade.estado.sigla
                : '',
              Validators.required,
            ],
          }),
        }),
        cep: [
          fornecedor && fornecedor.endereco ? fornecedor.endereco.cep : '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
          ]),
        ],
        quadra: [
          fornecedor && fornecedor.endereco ? fornecedor.endereco.quadra : '',
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(10),
          ]),
        ],
        rua: [
          fornecedor && fornecedor.endereco ? fornecedor.endereco.rua : '',
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(60),
          ]),
        ],
        numero: [
          fornecedor && fornecedor.endereco ? fornecedor.endereco.numero : '',
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(10),
          ]),
        ],
        complemento: [
          fornecedor && fornecedor.endereco
            ? fornecedor.endereco.complemento
            : '',
          Validators.compose([
            Validators.minLength(2),
            Validators.maxLength(60),
          ]),
        ],
        principal: [
          fornecedor && fornecedor.endereco
            ? fornecedor.endereco.principal
            : false,
        ],
        ativo: [
          fornecedor && fornecedor.endereco ? fornecedor.endereco.ativo : true,
        ],
      }),
    });
  }

  tratarErros(errorResponse: HttpErrorResponse) {
    if (errorResponse.status === 400) {
      if (errorResponse.error?.errors) {
        errorResponse.error.errors.forEach((validdationError: any) => {
          const formControl = this.formGroup.get(validdationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validdationError.message });
          }
        });
      }
    } else if (errorResponse.status < 400) {
      alert(
        errorResponse.error?.message || 'Erro generico do envio do formulario'
      );
    } else if (errorResponse.status >= 500) {
      alert('Erro no servidor');
    }
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      const operacao =
        fornecedor.id == null
          ? this.fornecedorService.insert(fornecedor)
          : this.fornecedorService.update(fornecedor);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/fornecedor');
          this.snackBar.open('Fornecedor salvo com sucesso', 'OK', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro ao salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao salvar fornecedor', 'OK', {
            duration: 3000,
          });
        },
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message:
              'Deseja realmente excluir este fornecedor? Não será possível reverter.',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.fornecedorService.delete(fornecedor).subscribe({
              next: () => {
                this.router.navigateByUrl('/admin/fornecedores');
                this.snackBar.open(
                  'O Fornecedor foi excluído com Sucesso!!',
                  'Fechar',
                  { duration: 3000 }
                );
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open(
                  'Erro ao tentar excluir o Fornecedor',
                  'Fechar',
                  { duration: 3000 }
                );
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
        this.errorMessage[controlName] &&
        this.errorMessage[controlName][errorName]
      ) {
        return this.errorMessage[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

  carregarEstados() {
    this.estadoService.findAll().subscribe((estados) => {
      this.estados = estados;
    });
  }

  onEstadoChange(event: any) {
    const estadoId = event.value;
    this.cidadeService.findByEstado(estadoId).subscribe((cidades) => {
      this.cidades = cidades;
    });
  }

  errorMessage: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado',
      minlength: 'O nome deve ter no mínimo 2 caracteres',
      maxlength: 'O nome deve ter no máximo 60 caracteres',
      apiError: '',
    },
    cnpj: {
      required: 'O CNPJ deve ser informado',
      minlength: 'O CNPJ deve ter 14 caracteres',
      maxlength: 'O CNPJ deve ter 14 caracteres',
      apiError: '',
    },
    'endereco.cep': {
      required: 'O CEP deve ser informado',
      minlength: 'O CEP deve ter 8 caracteres',
      maxlength: 'O CEP deve ter 8 caracteres',
      apiError: '',
    },
    'endereco.quadra': {
      required: 'A quadra deve ser informada',
      minlength: 'A quadra deve ter no mínimo 1 caractere',
      maxlength: 'A quadra deve ter no máximo 10 caracteres',
      apiError: '',
    },
    'endereco.rua': {
      required: 'A rua deve ser informada',
      minlength: 'A rua deve ter no mínimo 2 caracteres',
      maxlength: 'A rua deve ter no máximo 60 caracteres',
      apiError: '',
    },
    'endereco.numero': {
      required: 'O número deve ser informado',
      minlength: 'O número deve ter no mínimo 1 caractere',
      maxlength: 'O número deve ter no máximo 10 caracteres',
      apiError: '',
    },
    'endereco.complemento': {
      minlength: 'O complemento deve ter no mínimo 2 caracteres',
      maxlength: 'O complemento deve ter no máximo 60 caracteres',
      apiError: '',
    },
    'endereco.cidade.nome': {
      required: 'O nome da cidade deve ser informado',
      apiError: '',
    },
    'endereco.cidade.estado.nome': {
      required: 'O nome do estado deve ser informado',
      apiError: '',
    },
    'endereco.cidade.estado.sigla': {
      required: 'A sigla do estado deve ser informada',
      apiError: '',
    },
  };
}
