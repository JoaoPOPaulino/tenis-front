import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgFor,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  teamMembers = [
    {
      name: 'João Pedro de Oliveira Paulino',
      instagram: 'https://www.instagram.com/jp.oliveirapaulino/',
      github: 'https://github.com/JoaoPOPaulino',
    },
    {
      name: 'Luiz Oliveira',
      instagram:
        'https://www.instagram.com/not_luizz_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      github: 'https://github.com/oluizoliveira997',
    },
  ];
}
