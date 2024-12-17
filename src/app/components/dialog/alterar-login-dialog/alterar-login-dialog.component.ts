// alterar-login-dialog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../services/usuario.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alterar-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './alterar-login-dialog.component.html',
  styleUrls: ['./alterar-login-dialog.component.css'],
})
export class AlterarLoginDialogComponent {
  formGroup: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AlterarLoginDialogComponent>,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      loginAtual: ['', Validators.required],
      novoLogin: ['', [Validators.required, Validators.minLength(4)]],
      senha: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const { loginAtual, novoLogin, senha } = this.formGroup.value;

      this.usuarioService.alterarLogin(loginAtual, novoLogin, senha).subscribe({
        next: () => {
          this.snackBar.open('Login alterado com sucesso!', 'OK', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erro ao alterar login:', error);
          this.snackBar.open(
            'Erro ao alterar login. Verifique suas credenciais.',
            'OK',
            { duration: 3000 }
          );
          this.isLoading = false;
        },
      });
    }
  }
}
