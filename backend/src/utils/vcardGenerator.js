const vCard = require('vcards-js');

class VCardGenerator {
  /**
   * Genera un vCard para una tarjeta digital
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {string} - Contenido del vCard en formato texto
   */
  generateVCard(cardData) {
    try {
      const vcard = vCard();
      
      // Información básica
      vcard.firstName = cardData.firstName || '';
      vcard.lastName = cardData.lastName || '';
      vcard.email = cardData.email;
      
      // Teléfonos
      if (cardData.workPhone) {
        vcard.workPhone = cardData.workPhone;
      }
      
      if (cardData.mobilePhone) {
        vcard.cellPhone = cardData.mobilePhone;
      }
      
      // Información corporativa
      vcard.organization = 'JASU';
      if (cardData.website) {
        vcard.url = cardData.website;
      }
      
      // Foto de perfil
      if (cardData.profilePicture) {
        vcard.photo.attachFromUrl(cardData.profilePicture, 'JPEG');
      }
      
      // Nota con información adicional
      let note = 'Tarjeta digital corporativa JASU';
      if (cardData.whatsappNumber) {
        note += `\nWhatsApp: ${cardData.whatsappNumber}`;
      }
      if (cardData.linkedinUrl) {
        note += `\nLinkedIn: ${cardData.linkedinUrl}`;
      }
      if (cardData.calendarUrl) {
        note += `\nCalendario: ${cardData.calendarUrl}`;
      }
      vcard.note = note;
      
      // Versión
      vcard.version = '3.0';
      
      return vcard.getFormattedString();
      
    } catch (error) {
      console.error('❌ Error generando vCard:', error);
      throw new Error(`Error al generar vCard: ${error.message}`);
    }
  }
  
  /**
   * Genera un vCard con información mínima para QR
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {string} - vCard optimizado para QR
   */
  generateQRVCard(cardData) {
    try {
      const vcard = vCard();
      
      // Solo información esencial para QR
      vcard.firstName = cardData.firstName || '';
      vcard.lastName = cardData.lastName || '';
      vcard.email = cardData.email;
      vcard.organization = 'JASU';
      
      // Teléfono principal (móvil o trabajo)
      const primaryPhone = cardData.mobilePhone || cardData.workPhone;
      if (primaryPhone) {
        vcard.cellPhone = primaryPhone;
      }
      
      // URL del sitio web
      if (cardData.website) {
        vcard.url = cardData.website;
      }
      
      return vcard.getFormattedString();
      
    } catch (error) {
      console.error('❌ Error generando vCard para QR:', error);
      throw new Error(`Error al generar vCard para QR: ${error.message}`);
    }
  }
  
  /**
   * Genera headers HTTP apropiados para descarga de vCard
   * @param {string} fullName - Nombre completo para el archivo
   * @returns {Object} - Headers HTTP
   */
  getVCardHeaders(fullName) {
    const fileName = `${fullName.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`;
    
    return {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-cache'
    };
  }
  
  /**
   * Valida los datos mínimos requeridos para generar un vCard
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {boolean} - true si los datos son válidos
   */
  validateCardData(cardData) {
    const required = ['fullName', 'email'];
    
    for (const field of required) {
      if (!cardData[field] || cardData[field].trim() === '') {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Extrae nombre y apellido del nombre completo
   * @param {string} fullName - Nombre completo
   * @returns {Object} - {firstName, lastName}
   */
  parseFullName(fullName) {
    const parts = fullName.trim().split(' ');
    
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }
    
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    
    return { firstName, lastName };
  }
}

module.exports = new VCardGenerator(); 