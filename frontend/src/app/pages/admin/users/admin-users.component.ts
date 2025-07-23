import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Usuarios
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Administra todos los usuarios registrados en JASU VCards
        </p>
        
        <div class="mt-8">
          <div class="card">
            <div class="card-body">
              <p class="text-center text-gray-500 dark:text-gray-400 py-8">
                Panel de gestión de usuarios en desarrollo...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminUsersComponent {} 