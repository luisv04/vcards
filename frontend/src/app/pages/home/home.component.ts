import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center">
              <img src="https://jasu.us/svg/jasu-logo.svg" alt="JASU" class="h-8 w-auto">
              <h1 class="ml-3 text-xl font-bold text-gray-900 dark:text-white">VCards</h1>
            </div>
            <nav class="flex items-center space-x-4">
              <a routerLink="/login" class="btn-primary">
                Iniciar Sesión
              </a>
            </nav>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-4xl font-bold text-gradient mb-6">
              Tarjetas Digitales Corporativas
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Crea tu tarjeta digital profesional con código QR personalizado. 
              Comparte tu información de contacto de manera moderna y eficiente.
            </p>
            
            <div class="grid md:grid-cols-3 gap-8 mt-12">
              <!-- Feature 1 -->
              <div class="card">
                <div class="card-body text-center">
                  <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Código QR Personalizado
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300">
                    Genera automáticamente tu código QR con los colores corporativos de JASU.
                  </p>
                </div>
              </div>

              <!-- Feature 2 -->
              <div class="card">
                <div class="card-body text-center">
                  <div class="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg class="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Acceso Móvil
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300">
                    Diseño responsivo optimizado para todos los dispositivos móviles.
                  </p>
                </div>
              </div>

              <!-- Feature 3 -->
              <div class="card">
                <div class="card-body text-center">
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Contacto Directo
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300">
                    Enlaces directos para WhatsApp, email y llamadas telefónicas.
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-12">
              <a routerLink="/login" class="btn-primary text-lg px-8 py-3">
                Crear Mi Tarjeta
              </a>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <p class="text-gray-600 dark:text-gray-300">
              © 2024 JASU. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class HomeComponent {} 