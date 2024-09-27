import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MarcaService } from '../../../services/marca.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, NgIf, MatInputModule],
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.css'
})
export class MarcaFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private marcaService: MarcaService,
    private router: Router) {
      this.formGroup = this.formBuilder.group({
        nome:['', Validators.required]
      })
    }
  
    onSubmit(){
      if(this.formGroup.valid){
        const novaMarca = this.formGroup.value;
        this.marcaService.insert(novaMarca).subscribe({
          next: (marcaCadastro) => {
            this.router.navigateByUrl('/marcas');
          },
          error: (err) => {
            console.log('Erro ao salvar', + JSON.stringify(err))
          }
        })
      }
    }
  
  }
