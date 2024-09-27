import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TenisService } from '../../../services/tenis.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';
import { Tenis } from '../../../models/tenis.model';


@Component({
  selector: 'app-tenis-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, NgIf, MatInputModule,
    MatCardModule, MatToolbarModule, RouterModule, MatSelectModule
  ],
  templateUrl: './tenis-form.component.html',
  styleUrl: './tenis-form.component.css'
})
export class TenisFormComponent {
  formGroup: FormGroup;
  marcas: Marca[] = [];

  constructor(private formBuilder: FormBuilder,
    private tenisService: TenisService,
    private marcaService: MarcaService,
    private router: Router,
    private activatedRoute: ActivatedRoute){
      this.formGroup = this.formBuilder.group({
        id: [null],
        nome:['', Validators.required],
        tamanho:['', Validators.required],
        marca: [null]
      })
    }

    ngOnInit(): void{
      this.marcaService.findAll().subscribe(data => {
        this.marcas = data;
        this.initializeForm();
      })
    }

    initializeForm(): void{
      const tenis: Tenis = this.activatedRoute.snapshot.data['tenis'];

      const marca = this.marcas.find(marca => marca.id === (tenis?.marca?.id || null));

      this.formGroup = this.formBuilder.group({
        id: [(tenis && tenis.id) ? tenis.id : null],
        nome: [(tenis && tenis.nome) ? tenis.nome : null, Validators.required],
        marca: [marca]
      })
      
    }
    
    salvar(){
      if (this.formGroup.valid){
        const tenis = this.formGroup.value;
        if(tenis.id == null){
          this.tenisService.insert(tenis).subscribe({
            next: (tenisCadastro) => {
              this.router.navigate(['/tenis']);
            },
            error: (err) => {
              console.log('Erro ao Incluir' + JSON.stringify(err));
            }
          });
        } else{
          this.tenisService.update(tenis).subscribe({
            next: (tenisAtualizado) => {
              this.router.navigate(['/tenis']);
            },
            error: (err) => {
              console.log('Erro ao Atualizar' + JSON.stringify(err));
            }
          })
        }
      }
    }
  
    excluir(){
      if (this.formGroup.valid){
        const tenis = this.formGroup.value;
        if(tenis.id != null){
          this.tenisService.delete(tenis.id).subscribe({
            next: () => {
              this.router.navigate(['/tenis']);
            },
            error:  (err) => {
              console.log('Erro ao Excluir' + JSON.stringify(err));
            }
          })
        }
      }
    }
}
