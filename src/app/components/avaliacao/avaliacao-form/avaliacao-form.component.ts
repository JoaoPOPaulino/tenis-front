import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AvaliacaoService } from '../../../services/avaliacao.service';
import { Router } from '@angular/router';
import { Tenis } from '../../../models/tenis.model';
import { Avaliacao } from '../../../models/avaliacao.model';
import { TenisService } from '../../../services/tenis.service';

@Component({
  selector: 'app-avaliacao-form',
  standalone: true,
  imports: [],
  templateUrl: './avaliacao-form.component.html',
  styleUrl: './avaliacao-form.component.css',
})
export class AvaliacaoFormComponent {
  formGruop: FormGroup;
  tenis: Tenis[] = [];
  activatedRoute: any;

  constructor(
    private formBuilder: FormBuilder,
    private avaliacaoService: AvaliacaoService,
    private tenisService: TenisService,
    private router: Router
  ) {
    this.formGruop = this.formBuilder.group({
      id: [null],
      tenis: ['', Validators.required],
      conteudo: [null],
    });
  }

  ngOnInit(): void {
    this.avaliacaoService.findAll(0, 999).subscribe((data) => {
      this.tenis = data;

      this.initializeForm();
    });
  }

  initializeForm(): void {
    const avaliacao: Avaliacao = this.activatedRoute.snapshot.data['avaliacao'];

    const tenis = this.tenis.find(
      (tenis) => tenis.id === avaliacao?.tenis?.id || null
    );

    this.formGruop = this.formBuilder.group({
      id: [avaliacao && avaliacao.id ? avaliacao.id : null],
      tenis: [tenis],
      conteudo: [
        avaliacao && avaliacao.conteudo ? avaliacao.conteudo : null,
        Validators.compose([Validators.required, Validators.maxLength(1000)]),
      ],
    });
  }

  salvar() {
    this.formGruop.markAllAsTouched();
    if (this.formGruop.valid) {
      const avaliacao = this.formGruop.value;
      if (avaliacao.id == null) {
        this.avaliacaoService.create(avaliacao).subscribe({
          next: (avaliacaoCadastro) => {
            this.router.navigate(['/avaliacao']);
          },
          error: (err) => {
            console.log('Erro ao Incluir' + JSON.stringify(err));
          },
        });
      } else {
        this.avaliacaoService.update(avaliacao).subscribe({
          next: (avaliacaoAtualizado) => {
            this.router.navigate(['/avaliacao']);
          },
          error: (err) => {
            console.log('Erro ao Editar' + JSON.stringify(err));
          },
        });
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  excluir() {
    if (this.formGruop.valid) {
      const avaliacao = this.formGruop.value;
      if (avaliacao.id != null) {
        this.avaliacaoService.delete(avaliacao).subscribe({
          next: () => {
            this.router.navigateByUrl('/avaliacoes');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          },
        });
      }
    }
  }

  getErrorMessage(
    controlConteudo: string,
    errors: ValidationErrors | null | undefined
  ): string {
    if (!errors) {
      return '';
    }
    for (const errorConteudo in errors) {
      if (
        errors.hasOwnProperty(errorConteudo) &&
        this.errorMessages[controlConteudo][errorConteudo]
      ) {
        return this.errorMessages[controlConteudo][errorConteudo];
      }
    }
    return '';
  }

  errorMessages: {
    [controlConteudo: string]: { [errorConteudo: string]: string };
  } = {
    nome: {
      required: 'A descricao deve ser informada.',
      maxlength: 'A descrição deve conter no máximo 1000 caracteres.',
    },
  };
}
