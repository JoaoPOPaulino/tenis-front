import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoUsuario } from '../../../models/tipo-usuario.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent {
  formGroup: FormGroup;
  tiposUsuario = Object.values(TipoUsuario);

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router) {
                this.formGroup = this.formBuilder.group({
                  nome: ['',Validators.required],
                  email: ['', Validators.required],
                  telefone:  ['', Validators.required],
                  endereco:  ['', Validators.required],
                  senha:  ['', Validators.required],
                  tipoUsuario: ['', Validators.required]
              });
              }


  onSubmit(){
    if(this.formGroup.valid){
      const novoUsuario = this.formGroup.value;
      this.usuarioService.insert(novoUsuario).subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: (err) => console.error('Erro ao cadastrar usuário:', err)
      });
    }
  }
}
