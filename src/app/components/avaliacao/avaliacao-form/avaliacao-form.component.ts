import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AvaliacaoService } from '../../../services/avaliacao.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Avaliacao } from '../../../models/avaliacao.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-avaliacao-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatCheckboxModule,
  ],
  templateUrl: './avaliacao-form.component.html',
  styleUrls: ['./avaliacao-form.component.css'],
})
export class AvaliacaoFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private avaliacaoService: AvaliacaoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      tenis: ['', Validators.required],
      usuario: ['', Validators.required],
      conteudo: ['', [Validators.required, Validators.minLength(10)]],
      nota: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      dataAvaliacao: [new Date(), Validators.required],
      ativa: [true],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    const avaliacao: Avaliacao = this.activatedRoute.snapshot.data['avaliacao'];

    if (avaliacao) {
      this.formGroup.patchValue(avaliacao);
    }
  }

  salvar() {
    if (this.formGroup.valid) {
      const avaliacao = this.formGroup.value;
      const operacao = avaliacao.id
        ? this.avaliacaoService.update(avaliacao)
        : this.avaliacaoService.insert(avaliacao);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/avaliacoes');
          this.snackBar.open('Avaliação salva com sucesso!', 'Ok', {
            duration: 3000,
          });
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

  excluir() {
    const avaliacao = this.formGroup.value;
    if (avaliacao.id) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Deseja realmente excluir esta avaliação?',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.avaliacaoService.delete(avaliacao).subscribe({
            next: () => {
              this.router.navigateByUrl('/avaliacoes');
              this.snackBar.open('Avaliação excluída com sucesso!', 'Ok', {
                duration: 3000,
              });
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
}
