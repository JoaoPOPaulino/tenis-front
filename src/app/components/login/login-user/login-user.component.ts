import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css'],
})
export class LoginUserComponent implements OnInit {
  loginForm: FormGroup;
  passwordResetForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  showPasswordResetForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.createLoginForm();
    this.passwordResetForm = this.createPasswordResetForm();
  }

  ngOnInit(): void {
    if (this.authService.getToken() && !this.authService.isTokenExpired()) {
      this.router.navigate(['/home']);
    }
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      login: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private createPasswordResetForm(): FormGroup {
    return this.formBuilder.group(
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

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName === 'login' ? 'Usuário' : 'Senha'} é obrigatório`;
      }
      if (control.errors['minlength']) {
        return `${
          controlName === 'login' ? 'Usuário' : 'Senha'
        } deve ter pelo menos ${
          controlName === 'login' ? '3' : '6'
        } caracteres`;
      }
      if (control.errors['maxlength']) {
        return `${
          controlName === 'login' ? 'Usuário' : 'Senha'
        } deve ter no máximo 20 caracteres`;
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { login, password } = this.loginForm.value;
      this.authService
        .loginUser(login, password)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (response) => {
            this.router.navigate(['/home']);
          },
          error: (error) => {
            let errorMessage = 'Usuário ou senha inválidos';
            if (error.status === 0) {
              errorMessage = 'Erro de conexão com o servidor';
            } else if (error.status === 401) {
              errorMessage = 'Usuário ou senha inválidos';
            }
            this.showSnackbar(errorMessage);
            this.loginForm.get('password')?.reset();
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['error-snackbar'],
    });
  }

  resetForm(): void {
    this.loginForm.reset();
    this.passwordResetForm.reset();
    this.isLoading = false;
    this.hidePassword = true;
    this.hideConfirmPassword = true;
    this.showPasswordResetForm = false;
  }

  navigateToCadastro(): void {
    this.router.navigate(['/novo-usuario']);
  }

  togglePasswordResetForm(): void {
    this.showPasswordResetForm = !this.showPasswordResetForm;
  }

  onResetPassword(): void {
    if (this.passwordResetForm.valid) {
      this.isLoading = true;
      const { email, senha } = this.passwordResetForm.value;
      this.usuarioService.redefinirSenha(email, senha).subscribe({
        next: () => {
          this.snackBar.open('Senha redefinida com sucesso!', 'OK', {
            duration: 3000,
          });
          this.togglePasswordResetForm();
          this.passwordResetForm.reset();
        },
        error: (error) => {
          console.error('Erro ao redefinir senha:', error);
          this.snackBar.open(
            'Erro ao redefinir senha. Por favor, tente novamente.',
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
