import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TenisService } from '../../../services/tenis.service';
import { MarcaService } from '../../../services/marca.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tenis } from '../../../models/tenis.model';
import { Marca } from '../../../models/marca.model';
import { Tamanho } from '../../../models/tamanho.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenis-form',
  standalone: true,
  imports: [
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './tenis-form.component.html',
  styleUrls: ['./tenis-form.component.css'],
})
export class TenisFormComponent implements OnInit {
  formGroup: FormGroup;
  marcas: Marca[] = [];
  tamanhos = Object.values(Tamanho);

  fornecedores: Fornecedor[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tenisService: TenisService,
    private marcaService: MarcaService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      estoque: [0, [Validators.required, Validators.min(0)]],
      fornecedor: [null, Validators.required],
      descricao: ['', Validators.required],
      marca: [null, Validators.required],
      modelo: ['', Validators.required],
      tamanho: [null, Validators.required],
      nomeImagem: [''],
    });
  }

  ngOnInit(): void {
    this.loadMarcas();
    this.loadFornecedores();
    this.initializeForm();
  }

  loadFornecedores() {
    this.fornecedorService
      .findAll()
      .subscribe((data) => (this.fornecedores = data));
  }

  loadMarcas() {
    this.marcaService.findAll().subscribe((data) => (this.marcas = data));
  }

  initializeForm() {
    const tenis: Tenis = this.activatedRoute.snapshot.data['tenis'];
    if (tenis) {
      this.formGroup.patchValue(tenis);
    }
  }

  salvar() {
    if (this.formGroup.valid) {
      const tenis = this.formGroup.value;
      const operacao = tenis.id
        ? this.tenisService.update(tenis)
        : this.tenisService.insert(tenis);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/tenis');
          this.snackBar.open('Tênis salvo com sucesso!', 'Ok', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Erro ao salvar tênis', error);
          this.snackBar.open('Erro ao salvar tênis', 'Ok', {
            duration: 3000,
          });
        },
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const tenis = this.formGroup.value;
      if (tenis.id) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            message: 'Deseja realmente excluir este tênis?',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.tenisService.delete(tenis).subscribe({
              next: () => {
                this.router.navigateByUrl('/tenis');
                this.snackBar.open('Tênis excluído com sucesso!', 'Ok', {
                  duration: 3000,
                });
              },
              error: (error) => {
                console.error('Erro ao excluir tênis', error);
                this.snackBar.open('Erro ao excluir tênis', 'Ok', {
                  duration: 3000,
                });
              },
            });
          }
        });
      }
    }
  }
}
