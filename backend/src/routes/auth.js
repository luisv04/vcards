const express = require('express');
const passport = require('passport');
const { User } = require('../models');
const { generateToken } = require('../middleware/auth');
const { validateAdminLogin } = require('../middleware/validation');

const router = express.Router();

/**
 * Ruta para iniciar autenticación con Google
 */
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

/**
 * Callback de Google OAuth
 */
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
      }
      
      // Generar token JWT
      const token = generateToken(req.user);
      
      // Obtener datos del usuario para el frontend
      const userData = req.user.toSafeJSON();
      
      // Redirigir al frontend con el token
      const redirectUrl = new URL('/auth/callback', process.env.FRONTEND_URL);
      redirectUrl.searchParams.set('token', token);
      redirectUrl.searchParams.set('user', JSON.stringify(userData));
      
      res.redirect(redirectUrl.toString());
      
    } catch (error) {
      console.error('Error en callback de Google:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

/**
 * Login de administrador con email y contraseña
 */
router.post('/admin/login', validateAdminLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario por email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }
    
    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }
    
    // Verificar que sea administrador
    if (!user.isAdmin) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: 'No tienes permisos de administrador'
      });
    }
    
    // Verificar que esté activo
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Cuenta desactivada',
        message: 'Tu cuenta ha sido desactivada'
      });
    }
    
    // Actualizar última conexión
    user.lastLogin = new Date();
    await user.save();
    
    // Generar token
    const token = generateToken(user);
    
    res.json({
      message: 'Login exitoso',
      token,
      user: user.toSafeJSON()
    });
    
  } catch (error) {
    console.error('Error en login de admin:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar el login'
    });
  }
});

/**
 * Verificar token y obtener información del usuario
 */
router.get('/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Incluir información de la tarjeta si existe
    const user = await User.findByPk(req.user.id, {
      include: ['card']
    });
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }
    
    res.json({
      user: user.toSafeJSON(),
      card: user.card ? user.card.getPublicData() : null
    });
    
  } catch (error) {
    console.error('Error obteniendo información del usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Renovar token
 */
router.post('/refresh', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Verificar que el usuario siga siendo válido
    const user = await User.findByPk(req.user.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El usuario ya no es válido'
      });
    }
    
    // Generar nuevo token
    const token = generateToken(user);
    
    res.json({
      message: 'Token renovado exitosamente',
      token,
      user: user.toSafeJSON()
    });
    
  } catch (error) {
    console.error('Error renovando token:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Logout (principalmente para limpiar datos del lado del cliente)
 */
router.post('/logout', (req, res) => {
  res.json({
    message: 'Logout exitoso',
    timestamp: new Date().toISOString()
  });
});

/**
 * Verificar estado de autenticación sin requerir login
 */
router.get('/status', (req, res) => {
  res.json({
    status: 'Servicio de autenticación activo',
    googleOAuth: !!process.env.GOOGLE_CLIENT_ID,
    adminLogin: true,
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 