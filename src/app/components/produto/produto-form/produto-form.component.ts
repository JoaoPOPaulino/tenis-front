import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { ProdutoService } from '../../../services/produto.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css'],
})
export class ProdutoFormComponent implements OnInit {
  formGroup: FormGroup;
  fornecedores: Fornecedor[] = [];
  isAdmin = false;

  constructor(
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      preco: [0, [Validators.required, Validators.min(0)]],
      estoque: [0, [Validators.required, Validators.min(0)]],
      descricao: ['', Validators.required],
      fornecedor: [null, Validators.required],
      imagemUrl: [''],
    });
  }

  ngOnInit(): void {
    console.log('Antes da inscrição: ', this.isAdmin);
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isAdmin = isLoggedIn && this.authService.isAdmin();
      console.log('Dentro da inscrição: ', this.isAdmin);
    });
    console.log('Depois da inscrição: ', this.isAdmin);

    this.loadFornecedores();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produtoService.findById(Number(id)).subscribe((produto) => {
        this.formGroup.patchValue(produto);
      });
    }
  }

  loadFornecedores(): void {
    this.fornecedorService.findAll().subscribe((fornecedores) => {
      this.fornecedores = fornecedores;
    });
  }

  save(): void {
    if (this.formGroup.valid) {
      const produto = this.formGroup.value;
      const operation = produto.id
        ? this.produtoService.update(produto)
        : this.produtoService.insert(produto);

      operation.subscribe({
        next: () => {
          this.snackBar.open('Produto salvo com sucesso', 'OK', {
            duration: 3000,
          });
          this.router.navigate(['/produtos']);
        },
        error: (error) => {
          console.error('Erro ao salvar produto', error);
          this.snackBar.open('Erro ao salvar produto', 'OK', {
            duration: 3000,
          });
        },
      });
    }
  }
}
