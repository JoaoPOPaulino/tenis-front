// alterar-senha.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css'],
})
export class AlterarSenhaComponent {
  formGroup: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );
  }

  // Validador customizado para verificar se as senhas são iguais
  checkPasswords(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;

    return senha === confirmarSenha ? null : { notSame: true };
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      const { email, senha } = this.formGroup.value;

      this.usuarioService.alterarSenha(email, senha).subscribe({
        next: () => {
          this.snackBar.open('Senha alterada com sucesso!', 'OK', {
            duration: 3000,
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao alterar senha:', error);
          this.snackBar.open(
            'Erro ao alterar senha. Por favor, tente novamente.',
            'OK',
            {
              duration: 3000,
            }
          );
          this.isLoading = false;
        },
      });
    } else {
      this.snackBar.open(
        'Por favor, preencha todos os campos corretamente.',
        'OK',
        {
          duration: 3000,
        }
      );
    }
  }
}
