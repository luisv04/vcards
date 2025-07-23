const { User } = require('../models');

async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.warn('⚠️  Variables ADMIN_EMAIL y ADMIN_PASSWORD no configuradas. Saltando creación de admin.');
      return;
    }
    
    // Verificar si ya existe un usuario administrador
    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });
    
    if (existingAdmin) {
      // Asegurar que tenga permisos de administrador
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('✅ Usuario administrador actualizado:', adminEmail);
      } else {
        console.log('✅ Usuario administrador ya existe:', adminEmail);
      }
      return existingAdmin;
    }
    
    // Crear nuevo usuario administrador
    const adminUser = await User.create({
      email: adminEmail,
      password: adminPassword,
      firstName: 'Administrador',
      lastName: 'JASU',
      isAdmin: true,
      isActive: true
    });
    
    console.log('✅ Usuario administrador creado exitosamente:', adminEmail);
    return adminUser;
    
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    throw error;
  }
}

module.exports = createAdminUser; 