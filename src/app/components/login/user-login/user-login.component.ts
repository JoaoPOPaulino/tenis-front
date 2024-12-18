// user-login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Adicione RouterLink aqui
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required]], // Alterado de 'login' para 'login'
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/ecommerce']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { login, password } = this.loginForm.value; // Alterado de 'login' para 'login'

      this.authService.login(login, password).subscribe({
        next: () => {
          this.router.navigate(['/ecommerce']);
          this.snackBar.open('Login realizado com sucesso!', 'OK', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro no login:', error);
          this.snackBar.open('Usuário ou senha inválidos', 'OK', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
    }
  }
}
