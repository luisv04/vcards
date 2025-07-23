const express = require('express');
const { User, Card } = require('../models');
const { authenticateJWT, requireActiveUser, requireOwnershipOrAdmin } = require('../middleware/auth');
const { validateCreateCard, validateUpdateCard, validateUuidParam } = require('../middleware/validation');
const qrGenerator = require('../utils/qrGenerator');
const vcardGenerator = require('../utils/vcardGenerator');

const router = express.Router();

/**
 * Obtener la tarjeta del usuario autenticado
 */
router.get('/my-card', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const card = await Card.findByUserId(req.user.id);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'No tienes una tarjeta digital creada'
      });
    }
    
    res.json({
      card: card.getPublicData()
    });
    
  } catch (error) {
    console.error('Error obteniendo tarjeta del usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Crear una nueva tarjeta para el usuario autenticado
 */
router.post('/create', authenticateJWT, requireActiveUser, validateCreateCard, async (req, res) => {
  try {
    // Verificar si el usuario ya tiene una tarjeta
    const existingCard = await Card.findByUserId(req.user.id);
    
    if (existingCard) {
      return res.status(400).json({
        error: 'Tarjeta ya existe',
        message: 'Ya tienes una tarjeta digital creada. Usa la función de actualizar para modificarla.'
      });
    }
    
    const cardData = {
      ...req.body,
      userId: req.user.id
    };
    
    // Autocompletar con datos del usuario si no se proporcionan
    if (!cardData.fullName) {
      cardData.fullName = req.user.getFullName();
    }
    if (!cardData.email) {
      cardData.email = req.user.email;
    }
    if (!cardData.profilePicture && req.user.profilePicture) {
      cardData.profilePicture = req.user.profilePicture;
    }
    
    // Crear la tarjeta
    const card = await Card.create(cardData);
    
    // Generar código QR
    try {
      const cardUrl = `${process.env.FRONTEND_URL}/card/${card.publicUrl}`;
      const qrPath = await qrGenerator.generateCardQR(cardUrl, card.id);
      
      card.qrCodePath = qrPath;
      await card.save();
    } catch (qrError) {
      console.warn('Error generando QR Code:', qrError);
      // No es crítico, la tarjeta se puede crear sin QR
    }
    
    res.status(201).json({
      message: 'Tarjeta creada exitosamente',
      card: card.getPublicData()
    });
    
  } catch (error) {
    console.error('Error creando tarjeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear la tarjeta'
    });
  }
});

/**
 * Actualizar la tarjeta del usuario autenticado
 */
router.put('/update', authenticateJWT, requireActiveUser, validateUpdateCard, async (req, res) => {
  try {
    const card = await Card.findByUserId(req.user.id);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'No tienes una tarjeta digital creada'
      });
    }
    
    const oldQrPath = card.qrCodePath;
    const oldPublicUrl = card.publicUrl;
    
    // Actualizar campos
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        card[key] = req.body[key];
      }
    });
    
    await card.save();
    
    // Regenerar QR si cambió la URL pública
    if (oldPublicUrl !== card.publicUrl) {
      try {
        const cardUrl = `${process.env.FRONTEND_URL}/card/${card.publicUrl}`;
        const qrPath = await qrGenerator.updateCardQR(cardUrl, card.id, oldQrPath);
        
        card.qrCodePath = qrPath;
        await card.save();
      } catch (qrError) {
        console.warn('Error actualizando QR Code:', qrError);
      }
    }
    
    res.json({
      message: 'Tarjeta actualizada exitosamente',
      card: card.getPublicData()
    });
    
  } catch (error) {
    console.error('Error actualizando tarjeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar la tarjeta'
    });
  }
});

/**
 * Eliminar la tarjeta del usuario autenticado
 */
router.delete('/delete', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const card = await Card.findByUserId(req.user.id);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'No tienes una tarjeta digital creada'
      });
    }
    
    // Eliminar QR code si existe
    if (card.qrCodePath) {
      await qrGenerator.deleteQR(card.qrCodePath);
    }
    
    await card.destroy();
    
    res.json({
      message: 'Tarjeta eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando tarjeta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar la tarjeta'
    });
  }
});

/**
 * Descargar vCard de la tarjeta del usuario
 */
router.get('/download-vcard', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const card = await Card.findByUserId(req.user.id);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'No tienes una tarjeta digital creada'
      });
    }
    
    // Validar datos de la tarjeta
    if (!vcardGenerator.validateCardData(card)) {
      return res.status(400).json({
        error: 'Datos insuficientes',
        message: 'La tarjeta no tiene los datos mínimos requeridos para generar un vCard'
      });
    }
    
    // Preparar datos para vCard
    const { firstName, lastName } = vcardGenerator.parseFullName(card.fullName);
    const vcardData = {
      ...card.getPublicData(),
      firstName,
      lastName
    };
    
    // Generar vCard
    const vcardContent = vcardGenerator.generateVCard(vcardData);
    
    // Configurar headers para descarga
    const headers = vcardGenerator.getVCardHeaders(card.fullName);
    Object.keys(headers).forEach(key => {
      res.set(key, headers[key]);
    });
    
    res.send(vcardContent);
    
  } catch (error) {
    console.error('Error generando vCard:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al generar el vCard'
    });
  }
});

/**
 * Regenerar código QR de la tarjeta
 */
router.post('/regenerate-qr', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const card = await Card.findByUserId(req.user.id);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'No tienes una tarjeta digital creada'
      });
    }
    
    const cardUrl = `${process.env.FRONTEND_URL}/card/${card.publicUrl}`;
    const qrPath = await qrGenerator.updateCardQR(cardUrl, card.id, card.qrCodePath);
    
    card.qrCodePath = qrPath;
    await card.save();
    
    res.json({
      message: 'Código QR regenerado exitosamente',
      qrCodePath: qrPath
    });
    
  } catch (error) {
    console.error('Error regenerando QR Code:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al regenerar el código QR'
    });
  }
});

/**
 * Obtener estadísticas de la tarjeta del usuario
 */
router.get('/stats', authenticateJWT, requireActiveUser, async (req, res) => {
  try {
    const card = await Card.findByUserId(req.user.id);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'No tienes una tarjeta digital creada'
      });
    }
    
    res.json({
      stats: {
        viewCount: card.viewCount,
        lastViewed: card.lastViewed,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
        isPublic: card.isPublic,
        publicUrl: card.publicUrl,
        hasQR: !!card.qrCodePath
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router; 