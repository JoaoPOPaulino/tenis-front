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
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    MatProgressBarModule,
  ],
  templateUrl: './tenis-form.component.html',
  styleUrls: ['./tenis-form.component.css'],
})
export class TenisFormComponent implements OnInit {
  formGroup: FormGroup;
  marcas: Marca[] = [];
  tamanhos = Object.values(Tamanho);
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadProgress = false;

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
      imagemUrl: [''],
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  salvar() {
    if (this.formGroup.valid) {
      const tenis = this.formGroup.value;

      this.tenisService.insert(tenis).subscribe({
        next: (tenisSalvo) => {
          if (this.selectedFile) {
            this.uploadProgress = true;
            this.tenisService
              .uploadImagem(tenisSalvo.id, this.selectedFile)
              .subscribe({
                next: () => {
                  this.uploadProgress = false;
                  this.router.navigate(['/tenis']);
                  this.snackBar.open('Tênis salvo com sucesso!', 'OK', {
                    duration: 3000,
                  });
                },
                error: (error) => {
                  console.error('Erro ao fazer upload da imagem:', error);
                  this.uploadProgress = false;
                  this.snackBar.open('Erro ao fazer upload da imagem', 'OK', {
                    duration: 3000,
                  });
                },
              });
          } else {
            this.router.navigate(['/tenis']);
            this.snackBar.open('Tênis salvo com sucesso!', 'OK', {
              duration: 3000,
            });
          }
        },
        error: (error) => {
          console.error('Erro ao salvar tênis:', error);
          this.snackBar.open('Erro ao salvar tênis', 'OK', {
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
