import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { AvaliacaoService } from '../../../services/avaliacao.service';
import { TenisService } from '../../../services/tenis.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';

import { Avaliacao } from '../../../models/avaliacao.model';
import { Tenis } from '../../../models/tenis.model';
import { Usuario } from '../../../models/usuario.model';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-avaliacao-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: './avaliacao-form.component.html',
  styleUrls: ['./avaliacao-form.component.css'],
})
export class AvaliacaoFormComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  tenis: Tenis[] = [];
  usuarios: Usuario[] = [];
  isLoading = false;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private avaliacaoService: AvaliacaoService,
    private tenisService: TenisService,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      tenis: [null, [Validators.required]],
      usuario: [null, [Validators.required]],
      conteudo: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      nota: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      dataAvaliacao: [new Date(), Validators.required],
      ativa: [true],
    });
  }

  ngOnInit(): void {
    this.loadDependencies();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDependencies(): void {
    this.isLoading = true;
    forkJoin({
      tenis: this.tenisService.findAll(),
      usuarios: this.usuarioService.findAll(),
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (data) => {
          this.tenis = data.tenis;
          this.usuarios = data.usuarios;
        },
        error: (error) => {
          console.error('Erro ao carregar dados', error);
          this.snackBar.open('Erro ao carregar dados necessários', 'Ok', {
            duration: 3000,
          });
        },
      });
  }

  private initializeForm(): void {
    const avaliacao: Avaliacao = this.activatedRoute.snapshot.data['avaliacao'];
    if (avaliacao) {
      this.formGroup.patchValue(avaliacao);
    }
  }

  salvar(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const avaliacao = this.formGroup.value;

      const operacao = avaliacao.id
        ? this.avaliacaoService.update(avaliacao)
        : this.avaliacaoService.insert(avaliacao);

      operacao
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isSubmitting = false))
        )
        .subscribe({
          next: () => {
            const mensagem = avaliacao.id
              ? 'Avaliação atualizada com sucesso!'
              : 'Avaliação criada com sucesso!';

            this.snackBar.open(mensagem, 'Ok', {
              duration: 3000,
            });
            this.router.navigateByUrl('/avaliacoes');
          },
          error: (error) => {
            console.error('Erro ao salvar avaliação', error);
            this.snackBar.open('Erro ao salvar avaliação', 'Ok', {
              duration: 3000,
            });
          },
        });
    }
  }

  excluir(): void {
    const avaliacao = this.formGroup.value;
    if (avaliacao.id) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirmar Exclusão',
          message: 'Deseja realmente excluir esta avaliação?',
        },
        width: '400px',
      });

      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          if (result) {
            this.isSubmitting = true;
            this.avaliacaoService
              .delete(avaliacao)
              .pipe(finalize(() => (this.isSubmitting = false)))
              .subscribe({
                next: () => {
                  this.snackBar.open('Avaliação excluída com sucesso!', 'Ok', {
                    duration: 3000,
                  });
                  this.router.navigateByUrl('/avaliacoes');
                },
                error: (error) => {
                  console.error('Erro ao excluir avaliação', error);
                  this.snackBar.open('Erro ao excluir avaliação', 'Ok', {
                    duration: 3000,
                  });
                },
              });
          }
        });
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.formGroup.get(field);
    return control ? control.hasError(error) && control.touched : false;
  }

  cancelar(): void {
    this.router.navigateByUrl('/avaliacoes');
  }

  isFieldInvalid(field: string): boolean {
    const control = this.formGroup.get(field);
    return control ? control.invalid && control.touched : false;
  }

  getErrorMessage(field: string): string {
    const control = this.formGroup.get(field);
    if (control) {
      if (control.hasError('required')) {
        return 'Campo obrigatório';
      }
      if (control.hasError('minlength')) {
        return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
      }
      if (control.hasError('maxlength')) {
        return `Máximo de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }
      if (control.hasError('min')) {
        return `Valor mínimo é ${control.errors?.['min'].min}`;
      }
      if (control.hasError('max')) {
        return `Valor máximo é ${control.errors?.['max'].max}`;
      }
    }
    return '';
  }
}
