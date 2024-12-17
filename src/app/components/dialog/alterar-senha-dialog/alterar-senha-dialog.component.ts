// alterar-senha-dialog.component.ts
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
  selector: 'app-alterar-senha-dialog',
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
  templateUrl: './alterar-senha-dialog.component.html',
  styleUrls: ['./alterar-senha-dialog.component.css'],
})
export class AlterarSenhaDialogComponent {
  formGroup: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AlterarSenhaDialogComponent>,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group(
      {
        senhaAtual: ['', Validators.required],
        novaSenha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', Validators.required],
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return novaSenha === confirmarSenha ? null : { notSame: true };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const { senhaAtual, novaSenha } = this.formGroup.value;

      this.usuarioService.alterarSenhaLogado(senhaAtual, novaSenha).subscribe({
        next: () => {
          this.snackBar.open('Senha alterada com sucesso!', 'OK', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erro ao alterar senha:', error);
          this.snackBar.open(
            'Erro ao alterar senha. Verifique a senha atual.',
            'OK',
            { duration: 3000 }
          );
          this.isLoading = false;
        },
      });
    }
  }
}
