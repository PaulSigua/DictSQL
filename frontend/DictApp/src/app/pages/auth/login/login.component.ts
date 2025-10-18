import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserLogin } from '../../../interfaces/user-login.interface';
import { response } from 'express';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  credentials: UserLogin = {
    email: '',
    password: ''
  }
  errorMessage: string | null = null;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {}

  login() {
    this.errorMessage = null;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Usuario logueado: ',response);
        this.authService.saveToken(response.access_token);
        this.router.navigate(['dashboard']);
      },
      error: (error) => {
        console.error('Error al iniciar sesion: ', error);
        this.errorMessage = error.error?.detail || 'Ocurrio un error desconocido durante el inicio de sesion.';
        this.errorMessage = this.translate.instant('AUTH.LOGIN.ERROR');
        
      }
    })
  }
}
