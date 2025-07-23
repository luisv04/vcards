const Joi = require('joi');

/**
 * Middleware para validar esquemas de datos
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));
      
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        details: errorDetails
      });
    }
    
    // Reemplazar los datos originales con los validados y limpiados
    req[property] = value;
    next();
  };
};

/**
 * Esquemas de validación
 */
const schemas = {
  // Autenticación
  adminLogin: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es requerido'
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'La contraseña es requerida'
      })
  }),
  
  // Usuario
  updateUser: Joi.object({
    firstName: Joi.string().min(1).max(100).trim(),
    lastName: Joi.string().min(1).max(100).trim(),
    language: Joi.string().valid('es', 'en'),
    theme: Joi.string().valid('light', 'dark'),
    isActive: Joi.boolean()
  }),
  
  // Tarjeta digital
  createCard: Joi.object({
    fullName: Joi.string().min(1).max(200).trim().required()
      .messages({
        'string.min': 'El nombre completo es requerido',
        'string.max': 'El nombre completo no puede exceder 200 caracteres',
        'any.required': 'El nombre completo es requerido'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es requerido'
      }),
    workPhone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]+$/).allow('', null)
      .messages({
        'string.pattern.base': 'El teléfono de trabajo debe tener un formato válido'
      }),
    mobilePhone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]+$/).allow('', null)
      .messages({
        'string.pattern.base': 'El teléfono móvil debe tener un formato válido'
      }),
    whatsappNumber: Joi.string().pattern(/^[\+]?[0-9]+$/).allow('', null)
      .messages({
        'string.pattern.base': 'El número de WhatsApp debe contener solo números y el símbolo +'
      }),
    linkedinUrl: Joi.string().uri().allow('', null)
      .messages({
        'string.uri': 'La URL de LinkedIn debe ser válida'
      }),
    calendarUrl: Joi.string().uri().allow('', null)
      .messages({
        'string.uri': 'La URL del calendario debe ser válida'
      }),
    backgroundColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default('#ffffff')
      .messages({
        'string.pattern.base': 'El color de fondo debe ser un código hexadecimal válido'
      }),
    textColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default('#000000')
      .messages({
        'string.pattern.base': 'El color del texto debe ser un código hexadecimal válido'
      }),
    isPublic: Joi.boolean().default(true)
  }),
  
  updateCard: Joi.object({
    fullName: Joi.string().min(1).max(200).trim(),
    email: Joi.string().email(),
    workPhone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]+$/).allow('', null),
    mobilePhone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]+$/).allow('', null),
    whatsappNumber: Joi.string().pattern(/^[\+]?[0-9]+$/).allow('', null),
    linkedinUrl: Joi.string().uri().allow('', null),
    calendarUrl: Joi.string().uri().allow('', null),
    backgroundColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    textColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
    isPublic: Joi.boolean(),
    publicUrl: Joi.string().min(3).max(100).pattern(/^[a-z0-9\-]+$/)
      .messages({
        'string.pattern.base': 'La URL pública solo puede contener letras minúsculas, números y guiones'
      })
  }),
  
  // Administración
  updateCalendarLink: Joi.object({
    calendarUrl: Joi.string().uri().required()
      .messages({
        'string.uri': 'Debe ser una URL válida',
        'any.required': 'La URL del calendario es requerida'
      })
  }),
  
  adminUpdateUser: Joi.object({
    firstName: Joi.string().min(1).max(100).trim(),
    lastName: Joi.string().min(1).max(100).trim(),
    email: Joi.string().email(),
    isActive: Joi.boolean(),
    isAdmin: Joi.boolean(),
    language: Joi.string().valid('es', 'en'),
    theme: Joi.string().valid('light', 'dark')
  }),
  
  // Parámetros de URL
  uuidParam: Joi.object({
    id: Joi.string().uuid().required()
      .messages({
        'string.uuid': 'El ID debe ser un UUID válido',
        'any.required': 'El ID es requerido'
      })
  }),
  
  publicUrlParam: Joi.object({
    publicUrl: Joi.string().min(3).max(100).pattern(/^[a-z0-9\-]+$/).required()
      .messages({
        'string.pattern.base': 'La URL pública debe contener solo letras minúsculas, números y guiones',
        'any.required': 'La URL pública es requerida'
      })
  })
};

/**
 * Validadores específicos para diferentes rutas
 */
const validators = {
  // Parámetros
  validateUuidParam: validate(schemas.uuidParam, 'params'),
  validatePublicUrlParam: validate(schemas.publicUrlParam, 'params'),
  
  // Autenticación
  validateAdminLogin: validate(schemas.adminLogin),
  
  // Usuario
  validateUpdateUser: validate(schemas.updateUser),
  validateAdminUpdateUser: validate(schemas.adminUpdateUser),
  
  // Tarjeta
  validateCreateCard: validate(schemas.createCard),
  validateUpdateCard: validate(schemas.updateCard),
  
  // Administración
  validateUpdateCalendarLink: validate(schemas.updateCalendarLink)
};

module.exports = {
  validate,
  schemas,
  ...validators
}; 