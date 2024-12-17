import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Usuario } from '../../../models/usuario.model';
import { TipoUsuario } from '../../../models/tipo-usuario.enum';
import { TipoCartao } from '../../../models/tipo-cartao.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
})
export class UsuarioFormComponent implements OnInit {
  formGroup: FormGroup;
  tiposUsuario = Object.values(TipoUsuario);
  tiposCartao = Object.values(TipoCartao);

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      login: ['', Validators.required],
      senha: ['', Validators.required],
      username: ['', Validators.required],
      tipoUsuario: [TipoUsuario.USUARIO, Validators.required],
      telefones: this.formBuilder.array([]),
      enderecos: this.formBuilder.array([]),
      cartoes: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    const usuario: Usuario = this.activatedRoute.snapshot.data['usuario'];
    if (usuario) {
      this.formGroup.patchValue(usuario);
      this.loadTelefones(usuario);
      this.loadEnderecos(usuario);
      this.loadCartoes(usuario);
    }
  }

  get telefonesArray() {
    return this.formGroup.get('telefones') as FormArray;
  }

  get enderecosArray() {
    return this.formGroup.get('enderecos') as FormArray;
  }

  get cartoesArray() {
    return this.formGroup.get('cartoes') as FormArray;
  }

  addTelefone() {
    const telefoneGroup = this.formBuilder.group({
      ddd: ['', Validators.required],
      numero: ['', Validators.required],
    });
    this.telefonesArray.push(telefoneGroup);
  }

  removeTelefone(index: number) {
    this.telefonesArray.removeAt(index);
  }

  addEndereco() {
    const enderecoGroup = this.formBuilder.group({
      cidade: this.formBuilder.group({
        id: [null],
        nome: ['', Validators.required],
        estado: this.formBuilder.group({
          id: [null],
          nome: ['', Validators.required],
          sigla: ['', Validators.required],
        }),
      }),
      cep: ['', Validators.required],
      quadra: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      principal: [false],
      ativo: [true],
    });
    this.enderecosArray.push(enderecoGroup);
  }

  removeEndereco(index: number) {
    this.enderecosArray.removeAt(index);
  }

  addCartao() {
    const cartaoGroup = this.formBuilder.group({
      tipoCartao: [TipoCartao.CREDITO, Validators.required],
      numero: ['', Validators.required],
      cvv: ['', Validators.required],
      validade: [null, Validators.required],
      titular: ['', Validators.required],
      cpf: ['', Validators.required],
      ativo: [true],
    });
    this.cartoesArray.push(cartaoGroup);
  }

  removeCartao(index: number) {
    this.cartoesArray.removeAt(index);
  }

  private loadTelefones(usuario: Usuario) {
    usuario.telefones?.forEach((telefone) => {
      this.telefonesArray.push(
        this.formBuilder.group({
          ddd: [telefone.ddd, Validators.required],
          numero: [telefone.numero, Validators.required],
        })
      );
    });
  }

  private loadEnderecos(usuario: Usuario) {
    usuario.enderecos?.forEach((endereco) => {
      this.enderecosArray.push(
        this.formBuilder.group({
          cidade: this.formBuilder.group({
            id: [endereco.cidade.id],
            nome: [endereco.cidade.nome, Validators.required],
            estado: this.formBuilder.group({
              id: [endereco.cidade.estado.id],
              nome: [endereco.cidade.estado.nome, Validators.required],
              sigla: [endereco.cidade.estado.sigla, Validators.required],
            }),
          }),
          cep: [endereco.cep, Validators.required],
          quadra: [endereco.quadra, Validators.required],
          rua: [endereco.rua, Validators.required],
          numero: [endereco.numero, Validators.required],
          complemento: [endereco.complemento],
          principal: [endereco.principal],
          ativo: [endereco.ativo],
        })
      );
    });
  }

  private loadCartoes(usuario: Usuario) {
    usuario.cartoes?.forEach((cartao) => {
      this.cartoesArray.push(
        this.formBuilder.group({
          tipoCartao: [cartao.tipoCartao, Validators.required],
          numero: [cartao.numero, Validators.required],
          cvv: [cartao.cvv, Validators.required],
          validade: [cartao.validade, Validators.required],
          titular: [cartao.titular, Validators.required],
          cpf: [cartao.cpf, Validators.required],
          ativo: [cartao.ativo],
        })
      );
    });
  }

  salvar() {
    if (this.formGroup.valid) {
      const usuario = this.formGroup.value;
      const operacao = usuario.id
        ? this.usuarioService.update(usuario)
        : this.usuarioService.insert(usuario);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/usuarios');
          this.snackBar.open('Usuário salvo com sucesso!', 'Ok', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro ao salvar usuário', error);
          this.snackBar.open('Erro ao salvar usuário', 'Ok', {
            duration: 3000,
          });
        },
      });
    }
  }

  excluir() {
    const usuario = this.formGroup.value;
    if (usuario.id) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'Deseja realmente excluir este usuário?',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.usuarioService.delete(usuario).subscribe({
            next: () => {
              this.router.navigateByUrl('/usuarios');
              this.snackBar.open('Usuário excluído com sucesso!', 'Ok', {
                duration: 3000,
              });
            },
            error: (error) => {
              console.error('Erro ao excluir usuário', error);
              this.snackBar.open('Erro ao excluir usuário', 'Ok', {
                duration: 3000,
              });
            },
          });
        }
      });
    }
  }
}
