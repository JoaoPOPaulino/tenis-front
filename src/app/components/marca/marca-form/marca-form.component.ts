import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaService } from '../../../services/marca.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Marca } from '../../../models/marca.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.css'],
})
export class MarcaFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private marcaService: MarcaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      nomeImagem: [''],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    const marca: Marca = this.activatedRoute.snapshot.data['marca'];

    this.formGroup = this.formBuilder.group({
      id: [marca && marca.id ? marca.id : null],
      nome: [marca && marca.nome ? marca.nome : '', Validators.required],
      nomeImagem: [marca && marca.nomeImagem ? marca.nomeImagem : ''],
    });
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
      alert(
        errorResponse.error?.message || 'Erro genérico do envio do formulário'
      );
    } else if (errorResponse.status >= 500) {
      alert('Erro no servidor');
    }
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const marca = this.formGroup.value;
      const operacao =
        marca.id == null
          ? this.marcaService.insert(marca)
          : this.marcaService.update(marca);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/marcas');
          this.snackBar.open('Marca salva com sucesso', 'OK', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro ao salvar' + JSON.stringify(error));
          this.tratarErros(error);
          this.snackBar.open('Erro ao salvar marca', 'OK', { duration: 3000 });
        },
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const marca = this.formGroup.value;
      if (marca.id != null) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message:
              'Deseja realmente excluir esta marca? Não será possível reverter.',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.marcaService.delete(marca).subscribe({
              next: () => {
                this.router.navigateByUrl('/marcas');
                this.snackBar.open(
                  'A marca foi excluída com sucesso!',
                  'Fechar',
                  { duration: 3000 }
                );
              },
              error: (err) => {
                console.log('Erro ao excluir' + JSON.stringify(err));
                this.snackBar.open('Erro ao tentar excluir a marca', 'Fechar', {
                  duration: 3000,
                });
              },
            });
          }
        });
      }
    }
  }
}
