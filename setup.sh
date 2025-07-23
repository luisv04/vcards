#!/bin/bash

# JASU VCards Setup Script
# Script para configuración automatizada del proyecto

echo "🎴 JASU VCards - Script de Configuración"
echo "========================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerrequisitos
check_prerequisites() {
    log "Verificando prerrequisitos..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
    
    log "✅ Prerrequisitos verificados"
}

# Crear archivo .env si no existe
create_env_file() {
    if [ ! -f ".env" ]; then
        log "Creando archivo .env desde template..."
        
        if [ -f "environment.config.example" ]; then
            cp environment.config.example .env
            log "✅ Archivo .env creado"
            warn "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales antes de continuar"
            warn "    - Configura GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET"
            warn "    - Cambia las contraseñas por defecto"
            warn "    - Ajusta ADMIN_EMAIL y ADMIN_PASSWORD"
        else
            error "No se encontró environment.config.example"
            exit 1
        fi
    else
        log "✅ Archivo .env ya existe"
    fi
}

# Verificar configuración mínima en .env
check_env_config() {
    log "Verificando configuración del archivo .env..."
    
    if [ ! -f ".env" ]; then
        error "Archivo .env no encontrado"
        exit 1
    fi
    
    # Verificar variables críticas
    if grep -q "your_google_client_id" .env; then
        warn "⚠️  Aún tienes configuraciones por defecto en .env"
        warn "    Por favor configura GOOGLE_CLIENT_ID antes de continuar"
    fi
    
    if grep -q "your_secure_" .env; then
        warn "⚠️  Aún tienes contraseñas por defecto en .env"
        warn "    Por favor configura contraseñas seguras antes de continuar"
    fi
    
    log "✅ Configuración .env verificada"
}

# Crear directorios necesarios
create_directories() {
    log "Creando directorios necesarios..."
    
    mkdir -p backend/uploads
    mkdir -p backend/qr-codes
    mkdir -p frontend/src/assets/icons
    
    log "✅ Directorios creados"
}

# Construir y ejecutar con Docker Compose
build_and_run() {
    log "Construyendo y ejecutando la aplicación con Docker Compose..."
    
    echo -e "${BLUE}¿Deseas ejecutar en modo detached (segundo plano)? [y/N]${NC}"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        docker-compose up --build -d
        log "✅ Aplicación ejecutándose en segundo plano"
        log "📱 Frontend: http://localhost:4200"
        log "🔧 Backend API: http://localhost:3000"
        log "💾 PostgreSQL: localhost:5432"
        echo ""
        log "Para ver logs: docker-compose logs -f"
        log "Para parar: docker-compose down"
    else
        log "Ejecutando en primer plano (Ctrl+C para parar)..."
        docker-compose up --build
    fi
}

# Mostrar información post-instalación
show_post_install_info() {
    echo ""
    echo "🎉 ¡Configuración completada!"
    echo "============================"
    echo ""
    echo -e "${GREEN}URLs de la aplicación:${NC}"
    echo "  Frontend: http://localhost:4200"
    echo "  Backend:  http://localhost:3000"
    echo "  Health:   http://localhost:3000/health"
    echo ""
    echo -e "${GREEN}Próximos pasos:${NC}"
    echo "  1. Configura Google OAuth en Google Cloud Console"
    echo "  2. Actualiza GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env"
    echo "  3. Accede a la aplicación en http://localhost:4200"
    echo "  4. Inicia sesión con tu cuenta @jasu.us"
    echo ""
    echo -e "${GREEN}Para administradores:${NC}"
    echo "  - Email: admin@jasu.us (configurable en .env)"
    echo "  - Password: configurado en ADMIN_PASSWORD del .env"
    echo ""
    echo -e "${GREEN}Comandos útiles:${NC}"
    echo "  docker-compose logs -f     # Ver logs"
    echo "  docker-compose down        # Parar servicios"
    echo "  docker-compose restart     # Reiniciar servicios"
    echo ""
}

# Función principal
main() {
    echo ""
    check_prerequisites
    echo ""
    create_env_file
    echo ""
    check_env_config
    echo ""
    create_directories
    echo ""
    
    echo -e "${BLUE}¿Deseas construir y ejecutar la aplicación ahora? [Y/n]${NC}"
    read -r response
    
    if [[ ! "$response" =~ ^[Nn]$ ]]; then
        echo ""
        build_and_run
        echo ""
        show_post_install_info
    else
        log "Setup completado. Ejecuta 'docker-compose up --build' cuando estés listo."
        echo ""
        show_post_install_info
    fi
}

# Ejecutar función principal
main 