import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center">
              <img src="https://jasu.us/svg/jasu-logo.svg" alt="JASU" class="h-8 w-auto">
              <h1 class="ml-3 text-xl font-bold text-gray-900 dark:text-white">VCards Dashboard</h1>
            </div>
            <nav class="flex items-center space-x-4">
              <button class="btn-outline">
                Mi Perfil
              </button>
              <button class="btn-primary">
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            ¡Bienvenido a tu Panel de Control!
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Gestiona tu tarjeta digital y revisa tus estadísticas.
          </p>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Mi Tarjeta
                    </dt>
                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                      Crear / Editar
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Vistas Totales
                    </dt>
                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-body">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Descargar QR
                    </dt>
                    <dd class="text-lg font-medium text-gray-900 dark:text-white">
                      Código QR
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Card Preview -->
          <div class="card">
            <div class="card-body">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Vista Previa de tu Tarjeta
              </h3>
              
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                <div class="text-gray-500 dark:text-gray-400">
                  <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1h4a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1h4v3m0 0a1 1 0 001 1h8a1 1 0 001-1"></path>
                  </svg>
                  <p>Aún no has creado tu tarjeta digital</p>
                  <button class="mt-4 btn-primary">
                    Crear Mi Tarjeta
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card">
            <div class="card-body">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Actividad Reciente
              </h3>
              
              <div class="space-y-4">
                <div class="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No hay actividad reciente
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardComponent {} 