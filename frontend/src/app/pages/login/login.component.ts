import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <img src="https://jasu.us/svg/jasu-logo.svg" alt="JASU" class="mx-auto h-12 w-auto">
          <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Accede con tu cuenta de JASU
          </p>
        </div>

        <div class="card">
          <div class="card-body">
            <!-- Google OAuth Button -->
            <button 
              type="button" 
              class="w-full flex justify-center items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              (click)="loginWithGoogle()">
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>

            <div class="mt-6">
              <div class="divider"></div>
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    O para administradores
                  </span>
                </div>
              </div>
            </div>

            <!-- Admin Login Form -->
            <form class="mt-6 space-y-6" (ngSubmit)="loginWithEmail()">
              <div>
                <label for="email" class="label">Email de administrador</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  class="input"
                  placeholder="admin@jasu.us"
                  [(ngModel)]="adminCredentials.email">
              </div>
              
              <div>
                <label for="password" class="label">Contraseña</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  class="input"
                  placeholder="••••••••"
                  [(ngModel)]="adminCredentials.password">
              </div>

              <button 
                type="submit" 
                class="w-full btn-primary"
                [disabled]="isLoading">
                <span *ngIf="isLoading" class="loading-spinner mr-2"></span>
                Iniciar Sesión como Admin
              </button>
            </form>
          </div>
        </div>

        <div class="text-center">
          <a routerLink="/home" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  adminCredentials = {
    email: '',
    password: ''
  };
  
  isLoading = false;

  loginWithGoogle() {
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google';
  }

  loginWithEmail() {
    this.isLoading = true;
    // TODO: Implement admin login
    console.log('Admin login:', this.adminCredentials);
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
} 