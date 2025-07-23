const express = require('express');
const { User, Card } = require('../models');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');
const { 
  validateAdminUpdateUser, 
  validateUpdateCalendarLink, 
  validateUuidParam 
} = require('../middleware/validation');

const router = express.Router();

// Aplicar middleware de autenticación y admin a todas las rutas
router.use(authenticateJWT, requireAdmin);

/**
 * Obtener panel de estadísticas del administrador
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Estadísticas generales
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalCards = await Card.count();
    const publicCards = await Card.count({ where: { isPublic: true } });
    
    // Usuarios recientes (últimos 30 días)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: thirtyDaysAgo
        }
      }
    });
    
    // Tarjetas más vistas
    const topCards = await Card.findAll({
      limit: 10,
      order: [['viewCount', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });
    
    // Vistas totales
    const totalViews = await Card.sum('viewCount') || 0;
    
    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalCards,
        publicCards,
        recentUsers,
        totalViews
      },
      topCards: topCards.map(card => ({
        id: card.id,
        fullName: card.fullName,
        publicUrl: card.publicUrl,
        viewCount: card.viewCount,
        owner: card.user ? `${card.user.firstName} ${card.user.lastName}` : 'Usuario eliminado'
      }))
    });
    
  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Obtener lista de todos los usuarios
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, active } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    // Filtro de búsqueda
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { firstName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { lastName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Filtro de estado activo
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }
    
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      include: [{
        model: Card,
        as: 'card',
        attributes: ['id', 'publicUrl', 'viewCount', 'isPublic']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      users: users.map(user => ({
        ...user.toSafeJSON(),
        card: user.card ? {
          id: user.card.id,
          publicUrl: user.card.publicUrl,
          viewCount: user.card.viewCount,
          isPublic: user.card.isPublic
        } : null
      })),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Obtener detalles de un usuario específico
 */
router.get('/users/:id', validateUuidParam, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Card,
        as: 'card'
      }]
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
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Actualizar usuario
 */
router.put('/users/:id', validateUuidParam, validateAdminUpdateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }
    
    // No permitir que un admin se desactive a sí mismo
    if (req.body.isActive === false && user.id === req.user.id) {
      return res.status(400).json({
        error: 'No puedes desactivar tu propia cuenta'
      });
    }
    
    // No permitir que un admin se quite permisos de admin a sí mismo si es el único admin
    if (req.body.isAdmin === false && user.id === req.user.id) {
      const adminCount = await User.count({ where: { isAdmin: true } });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'No puedes quitarte permisos de admin si eres el único administrador'
        });
      }
    }
    
    // Actualizar campos
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });
    
    await user.save();
    
    res.json({
      message: 'Usuario actualizado exitosamente',
      user: user.toSafeJSON()
    });
    
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Eliminar usuario
 */
router.delete('/users/:id', validateUuidParam, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }
    
    // No permitir que un admin se elimine a sí mismo
    if (user.id === req.user.id) {
      return res.status(400).json({
        error: 'No puedes eliminar tu propia cuenta'
      });
    }
    
    // Verificar si es el último admin
    if (user.isAdmin) {
      const adminCount = await User.count({ where: { isAdmin: true } });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'No puedes eliminar al único administrador del sistema'
        });
      }
    }
    
    await user.destroy();
    
    res.json({
      message: 'Usuario eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Obtener configuración global
 */
router.get('/settings', async (req, res) => {
  try {
    // Por ahora solo el enlace del calendario es configurable
    const settings = {
      defaultCalendarLink: process.env.DEFAULT_CALENDAR_LINK || 'https://cal.com/jasu',
      companyLogo: process.env.COMPANY_LOGO_URL || 'https://jasu.us/svg/jasu-logo.svg',
      companyWebsite: process.env.COMPANY_WEBSITE || 'https://jasu.us',
      companyDomain: process.env.COMPANY_DOMAIN || 'jasu.us'
    };
    
    res.json({ settings });
    
  } catch (error) {
    console.error('Error obteniendo configuración:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Actualizar enlace de calendario por defecto
 */
router.put('/settings/calendar', validateUpdateCalendarLink, async (req, res) => {
  try {
    const { calendarUrl } = req.body;
    
    // En una implementación real, esto se guardaría en base de datos
    // Por ahora solo confirmamos que es válido
    res.json({
      message: 'Enlace de calendario actualizado. Nota: Para que el cambio sea permanente, actualiza la variable DEFAULT_CALENDAR_LINK en el archivo .env',
      calendarUrl
    });
    
  } catch (error) {
    console.error('Error actualizando calendario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Obtener estadísticas detalladas
 */
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Usuarios creados por día
    const usersByDay = await User.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
    });
    
    // Tarjetas creadas por día
    const cardsByDay = await Card.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: startDate
        }
      },
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
    });
    
    res.json({
      period: `${days} días`,
      usersByDay,
      cardsByDay
    });
    
  } catch (error) {
    console.error('Error obteniendo analytics:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router; 