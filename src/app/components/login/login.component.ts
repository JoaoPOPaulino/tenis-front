// import { Component, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatIconModule } from '@angular/material/icon';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { NgIf } from '@angular/common';
// import { AuthService } from '../../services/auth.service';
// import { finalize } from 'rxjs/operators';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     NgIf,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatCardModule,
//     MatToolbarModule,
//     MatIconModule,
//     MatProgressSpinnerModule,
//     RouterModule,
//   ],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
// })
// export class LoginComponent implements OnInit {
//   loginForm: FormGroup;
//   isLoading = false;
//   hidePassword = true;

//   constructor(
//     private formBuilder: FormBuilder,
//     private authService: AuthService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {
//     this.loginForm = this.createForm();
//   }

//   ngOnInit(): void {
//     // Verificar se já está logado
//     if (this.authService.getToken() && !this.authService.isTokenExpired()) {
//       this.router.navigate(['/admin']);
//     }
//   }

//   private createForm(): FormGroup {
//     return this.formBuilder.group({
//       login: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(3),
//           Validators.maxLength(20),
//         ],
//       ],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }

//   getErrorMessage(controlName: string): string {
//     const control = this.loginForm.get(controlName);

//     if (control?.errors && control.touched) {
//       if (control.errors['required']) {
//         return `${controlName === 'login' ? 'Usuário' : 'Senha'} é obrigatório`;
//       }
//       if (control.errors['minlength']) {
//         return `${
//           controlName === 'login' ? 'Usuário' : 'Senha'
//         } deve ter pelo menos ${
//           controlName === 'login' ? '3' : '6'
//         } caracteres`;
//       }
//       if (control.errors['maxlength']) {
//         return `${
//           controlName === 'login' ? 'Usuário' : 'Senha'
//         } deve ter no máximo ${
//           controlName === 'login' ? '20' : '20'
//         } caracteres`;
//       }
//     }
//     return '';
//   }

//   onSubmit(): void {
//     if (this.loginForm.valid && !this.isLoading) {
//       this.isLoading = true;
//       const { login, password } = this.loginForm.value;

//       console.log('Tentando login com:', { login, senha: password });

//       this.authService
//         .loginADM(login, password)
//         .pipe(finalize(() => (this.isLoading = false)))
//         .subscribe({
//           next: (response) => {
//             console.log('Login bem sucedido:', response);
//             this.router.navigate(['/admin']);
//           },
//           error: (error) => {
//             console.error('Erro no login:', error);
//             let errorMessage = 'Usuário ou senha inválidos';

//             if (error.status === 0) {
//               errorMessage = 'Erro de conexão com o servidor';
//             } else if (error.status === 401) {
//               errorMessage = 'Usuário ou senha inválidos';
//             } else if (error.status === 403) {
//               errorMessage = 'Acesso não autorizado';
//             } else if (error.status >= 500) {
//               errorMessage = 'Erro interno do servidor';
//             }

//             this.showSnackbar(errorMessage);
//             this.loginForm.get('password')?.reset();
//           },
//         });
//     } else {
//       this.loginForm.markAllAsTouched();
//     }
//   }

//   togglePasswordVisibility(): void {
//     this.hidePassword = !this.hidePassword;
//   }

//   private showSnackbar(message: string): void {
//     this.snackBar.open(message, 'Fechar', {
//       duration: 5000,
//       verticalPosition: 'top',
//       horizontalPosition: 'center',
//       panelClass: ['error-snackbar'],
//     });
//   }

//   resetForm(): void {
//     this.loginForm.reset();
//     this.isLoading = false;
//     this.hidePassword = true;
//   }
// }
