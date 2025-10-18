import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserCreate } from '../../../interfaces/user-create.interface';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  newUser: UserCreate = {
    username: '',
    email: '',
    password: ''
  };
  errorMessage: string | null = null;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.errorMessage = null;

    this.authService.register(this.newUser).subscribe({
      next: (response) => {
        console.log('Usuario registrado: ', response)
        this.router.navigate(['auth/login']);
      },
      error: (error) => {
        console.error('Error en el registro: ', error);
        const detail = error.error?.detail || 'Ocurrió un error desconocido durante el registro.';
        this.errorMessage = detail;
      }
    });
  }
}
