# 🎴 Tarjetas Digitales Corporativas JASU

Una aplicación full-stack moderna para crear y gestionar tarjetas digitales corporativas con códigos QR personalizados, diseñada específicamente para el dominio @jasu.us.

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad

- **Google OAuth** restringido al dominio `@jasu.us`
- **Panel de administración** con credenciales desde variables de entorno
- **JWT** para autenticación segura
- **Rate limiting** y validación de datos

### 👤 Gestión de Usuarios

- **Registro automático** con Google OAuth para usuarios de @jasu.us
- **Perfiles editables** con información personal y preferencias
- **Multilenguaje** (Español/Inglés)
- **Tema claro/oscuro**

### 🎯 Tarjetas Digitales

- **Autocompletado** con datos de Google (editables manualmente)
- **Logo corporativo** fijo de JASU
- **Información completa**: teléfonos, email, redes sociales
- **URLs públicas** personalizables y únicas
- **Estadísticas** de visualización

### 🎨 Códigos QR Personalizados

- **Colores corporativos**: `#235e39` (principal) y `#72aa52` (secundario)
- **Generación automática** al crear/actualizar tarjetas
- **Alta calidad** y legibilidad garantizada
- **Descarga de vCard** integrada

### 🌐 Visualización Pública

- **Acceso sin autenticación** a tarjetas públicas
- **Enlaces directos** para WhatsApp, email y llamadas
- **Descarga de vCard** desde vista pública
- **Contador de visualizaciones**

### ⚙️ Panel de Administración

- **Dashboard** con estadísticas completas
- **Gestión de usuarios** (editar, desactivar, eliminar)
- **Configuración global** (enlace de calendario)
- **Analytics** y reportes

## 🛠️ Tecnologías

### Backend

- **Node.js** + Express.js
- **PostgreSQL** con Sequelize ORM
- **Passport.js** para autenticación
- **QRCode** + **vCard-creator** para generación de archivos
- **JWT** + **bcrypt** para seguridad

### Frontend

- **Angular 17** con TypeScript
- **Tailwind CSS** para diseño responsivo
- **NGX-Translate** para internacionalización
- **PWA** ready con Service Worker

### DevOps

- **Docker Compose** para deployment
- **Nginx** para servir frontend
- **Variables de entorno** para configuración
- **Multi-stage builds** para optimización

## 🚀 Instalación y Uso

### Prerrequisitos

- Docker y Docker Compose
- Cuenta de Google Cloud con OAuth configurado
- Dominio @jasu.us para autenticación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd vcards
```

### 2. Configurar Variables de Entorno

Copia el archivo de configuración y personalízalo:

```bash
cp environment.config.example .env
```

**⚠️ IMPORTANTE:** Asegúrate de configurar todas las variables en el archivo `.env`:

```env
# Database Configuration
DB_NAME=vcards_db
DB_USER=vcards_user
DB_PASSWORD=tu_password_seguro

# Application Ports
BACKEND_PORT=3000
FRONTEND_PORT=4200

# URLs
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4200

# JWT Configuration
JWT_SECRET=tu_jwt_secret_muy_seguro

# Google OAuth Configuration
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret

# Admin User Configuration
ADMIN_EMAIL=admin@jasu.us
ADMIN_PASSWORD=tu_password_admin_seguro

# Default Calendar Link (CAL)
DEFAULT_CALENDAR_LINK=https://cal.com/jasu

# Company Configuration
COMPANY_LOGO_URL=https://jasu.us/svg/jasu-logo.svg
COMPANY_DOMAIN=jasu.us
COMPANY_WEBSITE=https://jasu.us

# QR Code Colors
QR_PRIMARY_COLOR=#235e39
QR_SECONDARY_COLOR=#72aa52
```

### 3. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+
4. Crea credenciales OAuth 2.0:
   - **Authorized JavaScript origins**: `http://localhost:4200`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/google/callback`

### 4. Ejecutar la Aplicación

```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# O en modo desarrollo (segundo plano)
docker-compose up --build -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Parar servicios
docker-compose down

# Parar servicios y eliminar volúmenes
docker-compose down -v
```

### 5. Acceder a la Aplicación

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Base de datos**: localhost:5432

## 📱 Uso de la Aplicación

### Para Usuarios

1. **Accede** a http://localhost:4200
2. **Inicia sesión** con tu cuenta @jasu.us
3. **Crea tu tarjeta** completando la información
4. **Personaliza** tu URL pública
5. **Descarga** tu código QR
6. **Comparte** tu tarjeta digital

### Para Administradores

1. **Inicia sesión** con las credenciales de admin del `.env`
2. **Accede al panel** de administración
3. **Gestiona usuarios** y configuraciones
4. **Configura** el enlace de calendario global
5. **Revisa** estadísticas y analytics

## 🏗️ Estructura del Proyecto

```
vcards/
├── docker-compose.yml          # Configuración de contenedores
├── environment.config.example  # Ejemplo de variables de entorno
├── .gitignore                  # Archivos ignorados por Git
├── backend/                    # Aplicación Node.js
│   ├── src/
│   │   ├── models/            # Modelos de base de datos
│   │   ├── routes/            # Rutas de la API
│   │   ├── middleware/        # Middlewares de autenticación
│   │   ├── utils/             # Utilidades (QR, vCard)
│   │   └── config/            # Configuración (Passport)
│   ├── uploads/               # Archivos subidos
│   ├── qr-codes/             # Códigos QR generados
│   ├── package.json
│   └── Dockerfile
├── frontend/                   # Aplicación Angular
│   ├── src/
│   │   ├── app/               # Componentes Angular
│   │   ├── assets/            # Recursos estáticos
│   │   └── index.html         # Archivo principal HTML
│   ├── tailwind.config.js     # Configuración Tailwind
│   ├── package.json
│   └── Dockerfile
└── README.md
```

## 🔧 Scripts de Desarrollo

### Backend

```bash
cd backend
npm install
npm run dev          # Modo desarrollo con nodemon
npm run build        # Construir aplicación
npm test            # Ejecutar tests
```

### Frontend

```bash
cd frontend
npm install
npm start           # Servidor de desarrollo
npm run build       # Construir para producción
npm test           # Ejecutar tests
```

## 📊 API Endpoints

### Autenticación

- `GET /api/auth/google` - Iniciar OAuth con Google
- `POST /api/auth/admin/login` - Login de administrador
- `GET /api/auth/me` - Información del usuario actual

### Tarjetas

- `GET /api/cards/my-card` - Obtener mi tarjeta
- `POST /api/cards/create` - Crear nueva tarjeta
- `PUT /api/cards/update` - Actualizar tarjeta
- `GET /api/cards/download-vcard` - Descargar vCard

### Público

- `GET /api/public/card/:publicUrl` - Ver tarjeta pública
- `GET /api/public/card/:publicUrl/vcard` - Descargar vCard público
- `GET /api/public/card/:publicUrl/whatsapp` - Enlace WhatsApp

### Administración

- `GET /api/admin/dashboard` - Estadísticas del dashboard
- `GET /api/admin/users` - Lista de usuarios
- `PUT /api/admin/users/:id` - Actualizar usuario
- `DELETE /api/admin/users/:id` - Eliminar usuario

## 🎨 Personalización

### Colores Corporativos

Los colores están definidos en `frontend/tailwind.config.js`:

```javascript
primary: {
  500: '#235e39', // Verde principal JASU
  // ... más tonos
},
secondary: {
  500: '#72aa52', // Verde secundario JASU
  // ... más tonos
}
```

### Configuración de QR

Los códigos QR se configuran en `backend/src/utils/qrGenerator.js`:

- Color principal: `#235e39`
- Color de ojos: `#72aa52`
- Alta corrección de errores
- Tamaño optimizado: 512x512px

## 🔒 Seguridad

- **Autenticación** restringida al dominio @jasu.us
- **Rate limiting** en todas las APIs
- **Validación** de datos con Joi
- **Sanitización** de entradas
- **CORS** configurado para dominios específicos
- **Headers** de seguridad con Helmet
- **Passwords** hasheados con bcrypt

## 🛠️ Solución de Problemas

### ✅ Problemas Solucionados

**Error de Docker con npm ci**: Los Dockerfiles ahora usan `npm install --omit=dev` en lugar de `npm ci`

**Backend conectándose antes que PostgreSQL**: Implementado healthcheck y reintentos de conexión:

- PostgreSQL con healthcheck que verifica que está listo para conexiones
- Backend espera hasta que PostgreSQL esté healthy usando `depends_on` con `condition`
- Lógica de reintentos con backoff exponencial en el backend (5 intentos)
- Reinicio automático de contenedores con `restart: unless-stopped`

### Otros Problemas Comunes

1. **Puerto ocupado**: Cambia los puertos en el archivo `.env`
2. **Error de permisos**: Asegúrate de que Docker tenga permisos
3. **Variables de entorno**: Verifica que el archivo `.env` existe y está configurado
4. **Base de datos no responde**: El sistema ahora maneja automáticamente las conexiones con reintentos

## 🚀 Deployment en Producción

1. **Configura** un servidor con Docker
2. **Clona** el repositorio
3. **Configura** variables de entorno para producción
4. **Ejecuta** `docker-compose up -d`
5. **Configura** un proxy reverso (nginx/traefik)
6. **Establece** SSL/TLS con Let's Encrypt

### Variables de Entorno para Producción

```env
NODE_ENV=production
FRONTEND_URL=https://vcards.jasu.us
API_URL=https://api-vcards.jasu.us
DB_PASSWORD=password_muy_seguro_en_produccion
JWT_SECRET=jwt_secret_muy_largo_y_seguro_en_produccion
```

## 📄 Licencia

Este proyecto está desarrollado para uso exclusivo de JASU.

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo de JASU.

---

**Desarrollado con ❤️ para JASU**
