import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoUsuario } from '../../../models/tipo-usuario.model';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent {
  formGroup: FormGroup;
  usuarioTipo: TipoUsuario [] = [];

  constructor(private formBuilder: FormBuilder,
    private  usuarioService: UsuarioService,
    private  tipoUsuario:  TipoUsuario,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.formGroup = this.formBuilder.group({
        id:  [''],
        nome:['', Validators.required],
        email: ['', Validators.required],
        senha: ['', Validators.required],
        telefone: ['', Validators.required],
        endereco:  ['', Validators.required],
        tipoUsuario: [null]
      })  
    }

    ngOnInit(): void{
      this.tipoUsuario.findAll().subscribe(data => {
        this.usuarioTipo = data;
        this.initializeForm();
      })
    }
}
