import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';
import { TipoUsuario } from '../../../models/tipo-usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { Endereco } from '../../../models/endereco.model';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
})
export class UsuarioFormComponent implements OnInit {
  formGroup: FormGroup;
  apiResponse: any = null;
  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  tipoUsuario: TipoUsuario[] = [];
  isEditRoute: boolean = false;
  isNewRoute: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      login: ['', Validators.required],
      senha: ['', Validators.required],
      enderecos: formBuilder.array([]),
      perfil: [null],
    });
  }

  ngOnInit(): void {
    this.usuarioService.findAll(0, 999).subscribe((data) => {
      this.usuarios = data;
      this.initializeForm();
    });

    this.usuarioService.getTipoUsuario().subscribe((data) => {
      this.tipoUsuario = data;
      this.initializeForm();
    });

    this.activatedRoute.url.subscribe((urlSegments) => {
      this.isEditRoute =
        urlSegments.length > 0 && urlSegments[0].path === 'edit';
    });

    this.activatedRoute.url.subscribe((urlSegments) => {
      this.isNewRoute = urlSegments.length > 0 && urlSegments[0].path === 'new';
    });
  }

  initializeForm() {
    const usuario: Usuario = this.activatedRoute.snapshot.data['usuario'];
    const tipoUsuario = this.tipoUsuario.find(
      (tipoUsuario) => tipoUsuario.id === (usuario?.tipoUsuario?.id || null)
    );

    this.formGroup = this.formBuilder.group({
      id: [usuario && usuario.id ? usuario.id : null],
      nome: [usuario && usuario.nome ? usuario.nome : '', Validators.required],
      login: [
        usuario && usuario.login ? usuario.login : '',
        Validators.required,
      ],
      senha: [
        usuario && usuario.senha ? usuario.senha : '',
        Validators.required,
      ],
      enderecos: this.formBuilder.array([]),
      tipoUsuario: [tipoUsuario],
    });

    if (usuario && usuario.endereco) {
      const enderecosFormArray = this.formGroup.get('enderecos') as FormArray;
      usuario.endereco.forEach((endereco: Endereco) => {
        enderecosFormArray.push(
          this.formBuilder.group({
            id: [endereco && endereco.id ? endereco.id : null],
            endereco: [
              endereco && endereco.cep ? endereco.cep : '',
              Validators.required,
            ],
            quadra: [
              endereco && endereco.quadra ? endereco.quadra : '',
              Validators.required,
            ],
            rua: [
              endereco && endereco.rua ? endereco.rua : '',
              Validators.required,
            ],
            numero: [
              endereco && endereco.numero ? endereco.numero : '',
              Validators.required,
            ],
            complemento: [
              endereco && endereco.complemento ? endereco.complemento : null,
            ],
          })
        );
      });
    }
  }

  salvar() {
    if (this.formGroup.valid) {
      const usuario = this.formGroup.value as Usuario;

      usuario.endereco = this.enderecos.value;

      if (usuario.id == null) {
        this.usuarioService.create(usuario).subscribe({
          next: (response) => {
            console.log(
              'Usuario cadastrado com sucesso' + JSON.stringify(response)
            );
            this.router.navigateByUrl('/admin/usuarios/list');
          },
          error: (error) => {
            this.apiResponse = error.error;

            this.formGroup
              .get('nome')
              ?.setErrors({ apiError: this.getErrorMessage('nome') });
            this.formGroup
              .get('login')
              ?.setErrors({ apiError: this.getErrorMessage('login') });

            console.log('Erro ao incluir' + JSON.stringify(error));
          },
        });
      } else {
        this.usuarioService.update(usuario).subscribe({
          next: (response) => {
            console.log(
              'Usuario atualizado com sucesso' + JSON.stringify(response)
            );
            this.router.navigateByUrl('/admin/usuarios/list');
          },
          error: (error) => {
            console.log('Erro ao alterar' + JSON.stringify(error));
          },
        });
      }
    }
  }

  excluir() {
    const usuario = this.formGroup.value;
    if (usuario.id != null) {
      this.usuarioService.delete(usuario).subscribe({
        next: (response) => {
          console.log(
            'Usuario excluido com sucesso' + JSON.stringify(response)
          );
          this.router.navigateByUrl('/admin/usuarios/list');
        },
        error: (err) => {
          console.log('Erro ao excluir' + JSON.stringify(err));
        },
      });
    }
  }

  adicionarEndereco() {
    const enderecoFormGroup = this.formBuilder.group({
      id: [null],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
    });

    this.enderecos.push(enderecoFormGroup);
  }

  deletarEndereco(enderecoId: number) {
    const usuario = this.formGroup.value as Usuario;

    if (usuario.id != null) {
      this.usuarioService.deletarEndereco(usuario.id, enderecoId).subscribe({
        next: (response) => {
          const enderecosFormArray = this.formGroup.get(
            'enderecos'
          ) as FormArray;

          const enderecoIndex = enderecosFormArray.controls.findIndex(
            (enderecoControl: AbstractControl) =>
              enderecoControl.get('id')?.value === enderecoId
          );

          if (enderecoIndex !== -1) {
            enderecosFormArray.removeAt(enderecoIndex);
          }
        },
        error: (error) => {
          console.log('Erro ao deletar endereco: ' + JSON.stringify(error));
        },
      });
    }
  }

  removerEndereco(index: number) {
    this.enderecos.removeAt(index);
  }

  getErrorMessage(fieldName: string): string {
    const error = this.apiResponse.errors.find(
      (error: any) => error.fieldName === fieldName
    );
    return error ? error.message : '';
  }

  get enderecos() {
    return this.formGroup.get('enderecos') as FormArray;
  }
}
