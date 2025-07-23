import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Administración
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Dashboard para administradores de JASU VCards
        </p>
        
        <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="card">
            <div class="card-body">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Usuarios Totales
              </h3>
              <p class="mt-2 text-3xl font-bold text-primary-600">0</p>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Tarjetas Creadas
              </h3>
              <p class="mt-2 text-3xl font-bold text-secondary-600">0</p>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Vistas Totales
              </h3>
              <p class="mt-2 text-3xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent {} 