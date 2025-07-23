const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs').promises;

class QRGenerator {
  constructor() {
    this.primaryColor = process.env.QR_PRIMARY_COLOR || '#235e39';
    this.secondaryColor = process.env.QR_SECONDARY_COLOR || '#72aa52';
    this.qrDir = path.join(__dirname, '../../qr-codes');
    
    // Asegurar que el directorio existe
    this.ensureQRDirectory();
  }
  
  async ensureQRDirectory() {
    try {
      await fs.access(this.qrDir);
    } catch (error) {
      await fs.mkdir(this.qrDir, { recursive: true });
    }
  }
  
  /**
   * Genera un código QR personalizado para una tarjeta
   * @param {string} cardUrl - URL de la tarjeta
   * @param {string} cardId - ID único de la tarjeta
   * @returns {Promise<string>} - Ruta del archivo QR generado
   */
  async generateCardQR(cardUrl, cardId) {
    try {
      await this.ensureQRDirectory();
      
      const fileName = `card-${cardId}.png`;
      const filePath = path.join(this.qrDir, fileName);
      
      // Configuración del QR con estilo personalizado
      const qrOptions = {
        type: 'png',
        quality: 0.92,
        margin: 2,
        width: 512,
        color: {
          dark: this.primaryColor,  // Color principal #235e39
          light: '#FFFFFF'          // Fondo blanco
        },
        errorCorrectionLevel: 'H', // Alto nivel de corrección de errores
      };
      
      // Generar el QR code
      await QRCode.toFile(filePath, cardUrl, qrOptions);
      
      console.log(`✅ QR Code generado: ${fileName}`);
      return `/qr-codes/${fileName}`;
      
    } catch (error) {
      console.error('❌ Error generando QR Code:', error);
      throw new Error(`Error al generar código QR: ${error.message}`);
    }
  }
  
  /**
   * Genera un código QR para vCard
   * @param {string} vcardData - Datos del vCard
   * @param {string} cardId - ID único de la tarjeta
   * @returns {Promise<string>} - Ruta del archivo QR generado
   */
  async generateVCardQR(vcardData, cardId) {
    try {
      await this.ensureQRDirectory();
      
      const fileName = `vcard-${cardId}.png`;
      const filePath = path.join(this.qrDir, fileName);
      
      const qrOptions = {
        type: 'png',
        quality: 0.92,
        margin: 2,
        width: 512,
        color: {
          dark: this.primaryColor,
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H',
      };
      
      await QRCode.toFile(filePath, vcardData, qrOptions);
      
      console.log(`✅ QR Code vCard generado: ${fileName}`);
      return `/qr-codes/${fileName}`;
      
    } catch (error) {
      console.error('❌ Error generando QR Code vCard:', error);
      throw new Error(`Error al generar código QR vCard: ${error.message}`);
    }
  }
  
  /**
   * Elimina un código QR existente
   * @param {string} qrPath - Ruta del QR a eliminar
   */
  async deleteQR(qrPath) {
    if (!qrPath) return;
    
    try {
      const fileName = path.basename(qrPath);
      const filePath = path.join(this.qrDir, fileName);
      
      await fs.access(filePath);
      await fs.unlink(filePath);
      
      console.log(`🗑️  QR Code eliminado: ${fileName}`);
    } catch (error) {
      // No es crítico si no se puede eliminar el archivo
      console.warn(`⚠️  No se pudo eliminar QR Code: ${qrPath}`);
    }
  }
  
  /**
   * Actualiza el QR de una tarjeta
   * @param {string} cardUrl - Nueva URL de la tarjeta
   * @param {string} cardId - ID de la tarjeta
   * @param {string} oldQrPath - Ruta del QR anterior (opcional)
   * @returns {Promise<string>} - Ruta del nuevo QR
   */
  async updateCardQR(cardUrl, cardId, oldQrPath = null) {
    try {
      // Eliminar QR anterior si existe
      if (oldQrPath) {
        await this.deleteQR(oldQrPath);
      }
      
      // Generar nuevo QR
      return await this.generateCardQR(cardUrl, cardId);
      
    } catch (error) {
      console.error('❌ Error actualizando QR Code:', error);
      throw error;
    }
  }
}

module.exports = new QRGenerator(); 