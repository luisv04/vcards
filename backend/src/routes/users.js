const express = require('express');
const { User } = require('../models');
const { authenticateJWT, requireActiveUser } = require('../middleware/auth');
const { validateUpdateUser } = require('../middleware/validation');

const router = express.Router();

/**
 * Obtener perfil del usuario autenticado
 */
router.get('/profile', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
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
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Actualizar perfil del usuario autenticado
 */
router.put('/profile', authenticateJWT, requireActiveUser, validateUpdateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }
    
    // Campos que el usuario puede actualizar
    const allowedFields = ['firstName', 'lastName', 'language', 'theme'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });
    
    await user.save();
    
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: user.toSafeJSON()
    });
    
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Obtener configuración del usuario
 */
router.get('/settings', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    res.json({
      settings: {
        language: user.language,
        theme: user.theme,
        emailNotifications: true, // Placeholder para futuras configuraciones
        profileVisibility: 'public' // Placeholder
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Actualizar configuración del usuario
 */
router.put('/settings', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { language, theme } = req.body;
    
    // Validar valores permitidos
    if (language && !['es', 'en'].includes(language)) {
      return res.status(400).json({
        error: 'Idioma no válido',
        message: 'Los idiomas permitidos son: es, en'
      });
    }
    
    if (theme && !['light', 'dark'].includes(theme)) {
      return res.status(400).json({
        error: 'Tema no válido',
        message: 'Los temas permitidos son: light, dark'
      });
    }
    
    // Actualizar configuración
    if (language) user.language = language;
    if (theme) user.theme = theme;
    
    await user.save();
    
    res.json({
      message: 'Configuración actualizada exitosamente',
      settings: {
        language: user.language,
        theme: user.theme
      }
    });
    
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Obtener estadísticas del usuario
 */
router.get('/stats', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: ['card']
    });
    
    if (!user.card) {
      return res.json({
        stats: {
          hasCard: false,
          message: 'No tienes una tarjeta digital creada'
        }
      });
    }
    
    // Estadísticas básicas del usuario
    const stats = {
      hasCard: true,
      cardCreated: user.card.createdAt,
      lastUpdate: user.card.updatedAt,
      totalViews: user.card.viewCount,
      lastViewed: user.card.lastViewed,
      isPublic: user.card.isPublic,
      publicUrl: user.card.publicUrl,
      accountCreated: user.createdAt,
      lastLogin: user.lastLogin
    };
    
    res.json({ stats });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Desactivar cuenta (soft delete)
 */
router.post('/deactivate', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    // No permitir que un admin se desactive si es el único
    if (user.isAdmin) {
      const adminCount = await User.count({ where: { isAdmin: true } });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'No puedes desactivar tu cuenta',
          message: 'Eres el único administrador del sistema'
        });
      }
    }
    
    user.isActive = false;
    await user.save();
    
    res.json({
      message: 'Cuenta desactivada exitosamente. Contacta al administrador para reactivarla.'
    });
    
  } catch (error) {
    console.error('Error desactivando cuenta:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Obtener información de la empresa
 */
router.get('/company-info', async (req, res) => {
  try {
    const companyInfo = {
      name: 'JASU',
      logo: process.env.COMPANY_LOGO_URL || 'https://jasu.us/svg/jasu-logo.svg',
      website: process.env.COMPANY_WEBSITE || 'https://jasu.us',
      domain: process.env.COMPANY_DOMAIN || 'jasu.us',
      defaultCalendar: process.env.DEFAULT_CALENDAR_LINK || 'https://cal.com/jasu'
    };
    
    res.json({ companyInfo });
    
  } catch (error) {
    console.error('Error obteniendo información de empresa:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router; 