const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Card = sequelize.define('Card', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    // Información básica
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    profilePicture: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    // Teléfonos
    workPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobilePhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    // Información corporativa (valores fijos)
    companyLogo: {
      type: DataTypes.STRING,
      defaultValue: process.env.COMPANY_LOGO_URL || 'https://jasu.us/svg/jasu-logo.svg'
    },
    website: {
      type: DataTypes.STRING,
      defaultValue: process.env.COMPANY_WEBSITE || 'https://jasu.us'
    },
    
    // Redes sociales y enlaces
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkedinUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    calendarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    
    // QR Code
    qrCodePath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    // URLs públicas
    publicUrl: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    
    // Configuración
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    backgroundColor: {
      type: DataTypes.STRING,
      defaultValue: '#ffffff'
    },
    textColor: {
      type: DataTypes.STRING,
      defaultValue: '#000000'
    },
    
    // Estadísticas
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastViewed: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'cards',
    hooks: {
      beforeCreate: async (card) => {
        if (!card.publicUrl) {
          // Generar URL pública única basada en el nombre
          const baseUrl = card.fullName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          let publicUrl = baseUrl;
          let counter = 1;
          
          // Verificar unicidad
          while (await Card.findOne({ where: { publicUrl } })) {
            publicUrl = `${baseUrl}-${counter}`;
            counter++;
          }
          
          card.publicUrl = publicUrl;
        }
      },
      beforeUpdate: async (card) => {
        // Regenerar URL si cambia el nombre y no se especifica una nueva
        if (card.changed('fullName') && !card.changed('publicUrl')) {
          const baseUrl = card.fullName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          let publicUrl = baseUrl;
          let counter = 1;
          
          // Verificar unicidad (excluyendo la tarjeta actual)
          while (await Card.findOne({ 
            where: { 
              publicUrl,
              id: { [require('sequelize').Op.ne]: card.id }
            } 
          })) {
            publicUrl = `${baseUrl}-${counter}`;
            counter++;
          }
          
          card.publicUrl = publicUrl;
        }
      }
    }
  });

  // Métodos de instancia
  Card.prototype.incrementViewCount = function() {
    this.viewCount += 1;
    this.lastViewed = new Date();
    return this.save();
  };

  Card.prototype.getPublicData = function() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      profilePicture: this.profilePicture,
      workPhone: this.workPhone,
      mobilePhone: this.mobilePhone,
      companyLogo: this.companyLogo,
      website: this.website,
      whatsappNumber: this.whatsappNumber,
      linkedinUrl: this.linkedinUrl,
      calendarUrl: this.calendarUrl,
      qrCodePath: this.qrCodePath,
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
      publicUrl: this.publicUrl
    };
  };

  Card.prototype.hasWhatsApp = function() {
    return !!this.whatsappNumber;
  };

  Card.prototype.hasLinkedIn = function() {
    return !!this.linkedinUrl;
  };

  Card.prototype.hasCalendar = function() {
    return !!this.calendarUrl;
  };

  // Métodos estáticos
  Card.findByPublicUrl = function(publicUrl) {
    return this.findOne({ where: { publicUrl, isPublic: true } });
  };

  Card.findByUserId = function(userId) {
    return this.findOne({ where: { userId } });
  };

  return Card;
}; 