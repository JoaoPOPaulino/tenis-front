import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TenisService } from '../../../../services/tenis.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-tenis-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, NgIf, MatInputModule],
  templateUrl: './tenis-form.component.html',
  styleUrl: './tenis-form.component.css'
})
export class TenisFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private tenisService: TenisService,
    private router: Router){
      this.formGroup = this.formBuilder.group({
        nome:['', Validators.required],
        tamanho:['', Validators.required]
      })
    }
  
    onSubmit(){
      if (this.formGroup.valid){
        const novoTenis = this.formGroup.value;
        this.tenisService.salvar(novoTenis).subscribe({
          next: (tenisCadastro) => {
            this.router.navigateByUrl('/tenis');
          },
          error: (err) => {
            console.log('Erro ao salvar', + JSON.stringify(err));
          }
        })
      }
    }
}
