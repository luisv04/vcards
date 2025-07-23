const express = require('express');
const { Card } = require('../models');
const { validatePublicUrlParam } = require('../middleware/validation');
const { optionalAuth } = require('../middleware/auth');
const vcardGenerator = require('../utils/vcardGenerator');

const router = express.Router();

/**
 * Obtener tarjeta pública por URL
 */
router.get('/card/:publicUrl', validatePublicUrlParam, optionalAuth, async (req, res) => {
  try {
    const { publicUrl } = req.params;
    
    const card = await Card.findByPublicUrl(publicUrl);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'La tarjeta solicitada no existe o no está disponible públicamente'
      });
    }
    
    // Incrementar contador de vistas (solo si no es el propietario)
    if (!req.user || req.user.id !== card.userId) {
      try {
        await card.incrementViewCount();
      } catch (error) {
        // No es crítico si falla el incremento
        console.warn('Error incrementando contador de vistas:', error);
      }
    }
    
    res.json({
      card: card.getPublicData(),
      isOwner: req.user ? req.user.id === card.userId : false
    });
    
  } catch (error) {
    console.error('Error obteniendo tarjeta pública:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Descargar vCard público
 */
router.get('/card/:publicUrl/vcard', validatePublicUrlParam, async (req, res) => {
  try {
    const { publicUrl } = req.params;
    
    const card = await Card.findByPublicUrl(publicUrl);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'La tarjeta solicitada no existe o no está disponible públicamente'
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
    console.error('Error generando vCard público:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al generar el vCard'
    });
  }
});

/**
 * Generar vCard QR dinámico
 */
router.get('/card/:publicUrl/qr-vcard', validatePublicUrlParam, async (req, res) => {
  try {
    const { publicUrl } = req.params;
    
    const card = await Card.findByPublicUrl(publicUrl);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada',
        message: 'La tarjeta solicitada no existe o no está disponible públicamente'
      });
    }
    
    // Validar datos de la tarjeta
    if (!vcardGenerator.validateCardData(card)) {
      return res.status(400).json({
        error: 'Datos insuficientes',
        message: 'La tarjeta no tiene los datos mínimos requeridos'
      });
    }
    
    // Preparar datos para vCard optimizado para QR
    const { firstName, lastName } = vcardGenerator.parseFullName(card.fullName);
    const vcardData = {
      ...card.getPublicData(),
      firstName,
      lastName
    };
    
    // Generar vCard optimizado para QR
    const vcardContent = vcardGenerator.generateQRVCard(vcardData);
    
    res.json({
      vcard: vcardContent,
      size: vcardContent.length
    });
    
  } catch (error) {
    console.error('Error generando vCard para QR:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Verificar disponibilidad de URL pública
 */
router.get('/check-url/:publicUrl', validatePublicUrlParam, async (req, res) => {
  try {
    const { publicUrl } = req.params;
    
    const existingCard = await Card.findOne({
      where: { publicUrl }
    });
    
    res.json({
      available: !existingCard,
      publicUrl
    });
    
  } catch (error) {
    console.error('Error verificando URL pública:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Obtener estadísticas públicas básicas de una tarjeta
 */
router.get('/card/:publicUrl/stats', validatePublicUrlParam, async (req, res) => {
  try {
    const { publicUrl } = req.params;
    
    const card = await Card.findByPublicUrl(publicUrl);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada'
      });
    }
    
    // Solo estadísticas públicas básicas
    res.json({
      stats: {
        viewCount: card.viewCount,
        hasWhatsApp: card.hasWhatsApp(),
        hasLinkedIn: card.hasLinkedIn(),
        hasCalendar: card.hasCalendar(),
        hasQR: !!card.qrCodePath
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas públicas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Generar enlace de WhatsApp
 */
router.get('/card/:publicUrl/whatsapp', validatePublicUrlParam, async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const { message } = req.query;
    
    const card = await Card.findByPublicUrl(publicUrl);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada'
      });
    }
    
    if (!card.whatsappNumber) {
      return res.status(400).json({
        error: 'WhatsApp no disponible',
        message: 'Esta tarjeta no tiene configurado un número de WhatsApp'
      });
    }
    
    // Limpiar número de WhatsApp
    const cleanNumber = card.whatsappNumber.replace(/[^0-9+]/g, '');
    
    // Crear mensaje por defecto
    const defaultMessage = `Hola ${card.fullName}, te contacto desde tu tarjeta digital.`;
    const finalMessage = message || defaultMessage;
    
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMessage)}`;
    
    res.json({
      whatsappUrl,
      number: card.whatsappNumber,
      message: finalMessage
    });
    
  } catch (error) {
    console.error('Error generando enlace de WhatsApp:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Generar enlace de email
 */
router.get('/card/:publicUrl/email', validatePublicUrlParam, async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const { subject, body } = req.query;
    
    const card = await Card.findByPublicUrl(publicUrl);
    
    if (!card) {
      return res.status(404).json({
        error: 'Tarjeta no encontrada'
      });
    }
    
    const defaultSubject = `Contacto desde tu tarjeta digital`;
    const defaultBody = `Hola ${card.fullName},\n\nTe contacto desde tu tarjeta digital.\n\nSaludos.`;
    
    const finalSubject = subject || defaultSubject;
    const finalBody = body || defaultBody;
    
    const emailUrl = `mailto:${card.email}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;
    
    res.json({
      emailUrl,
      email: card.email,
      subject: finalSubject,
      body: finalBody
    });
    
  } catch (error) {
    console.error('Error generando enlace de email:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router; 