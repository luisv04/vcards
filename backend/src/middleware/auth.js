const passport = require('passport');
const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticación con JWT
 */
const authenticateJWT = passport.authenticate('jwt', { session: false });

/**
 * Middleware para verificar que el usuario sea administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'No autenticado',
      message: 'Se requiere autenticación para acceder a este recurso'
    });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'Se requieren permisos de administrador'
    });
  }
  
  next();
};

/**
 * Middleware para verificar que el usuario sea activo
 */
const requireActiveUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'No autenticado',
      message: 'Se requiere autenticación para acceder a este recurso'
    });
  }
  
  if (!req.user.isActive) {
    return res.status(403).json({
      error: 'Cuenta desactivada',
      message: 'Tu cuenta ha sido desactivada. Contacta al administrador'
    });
  }
  
  next();
};

/**
 * Middleware para verificar que el usuario pueda acceder a un recurso específico
 * Permite acceso si es admin o si es el propietario del recurso
 */
const requireOwnershipOrAdmin = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Se requiere autenticación para acceder a este recurso'
      });
    }
    
    const resourceUserId = req.params[userIdParam] || req.body[userIdParam];
    
    // Permitir acceso si es admin o si es el propietario
    if (req.user.isAdmin || req.user.id === resourceUserId) {
      return next();
    }
    
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'No tienes permisos para acceder a este recurso'
    });
  };
};

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero establece req.user si es válido
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Buscar el usuario sin incluir información sensible
    const { User } = require('../models');
    
    User.findByPk(decoded.userId)
      .then(user => {
        if (user && user.isActive) {
          req.user = user;
        }
        next();
      })
      .catch(() => next());
      
  } catch (error) {
    next();
  }
};

/**
 * Genera un token JWT para un usuario
 */
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    isAdmin: user.isAdmin
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
    issuer: 'jasu-vcards',
    audience: 'jasu-vcards-users'
  });
};

/**
 * Verifica un token JWT sin middleware
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateJWT,
  requireAdmin,
  requireActiveUser,
  requireOwnershipOrAdmin,
  optionalAuth,
  generateToken,
  verifyToken
}; 
