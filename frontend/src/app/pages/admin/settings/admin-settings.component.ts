import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración Global
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Configura los ajustes globales de JASU VCards
        </p>
        
        <div class="mt-8">
          <div class="card">
            <div class="card-body">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Enlace de Calendario por Defecto
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Configura el enlace de calendario que se usará por defecto para todos los usuarios.
              </p>
              <div class="flex items-center space-x-4">
                <input 
                  type="url" 
                  class="input flex-1" 
                  placeholder="https://cal.com/jasu"
                  value="https://cal.com/jasu">
                <button class="btn-primary">
                  Guardar
                </button>
              </div>
            </div>
          </div>
          
          <div class="card mt-6">
            <div class="card-body">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Información de la Empresa
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="label">Logo de la Empresa</label>
                  <input type="url" class="input" value="https://jasu.us/svg/jasu-logo.svg" readonly>
                </div>
                <div>
                  <label class="label">Sitio Web</label>
                  <input type="url" class="input" value="https://jasu.us" readonly>
                </div>
                <div>
                  <label class="label">Dominio de Email</label>
                  <input type="text" class="input" value="jasu.us" readonly>
                </div>
                <div>
                  <label class="label">Colores QR</label>
                  <div class="flex space-x-2">
                    <input type="color" value="#235e39" class="w-12 h-10 rounded border border-gray-300" readonly>
                    <input type="color" value="#72aa52" class="w-12 h-10 rounded border border-gray-300" readonly>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminSettingsComponent {} 