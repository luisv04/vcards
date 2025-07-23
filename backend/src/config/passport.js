const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require('../models');

// Configuración de Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    
    // Verificar que el email sea del dominio @jasu.us
    if (!email.endsWith('@jasu.us')) {
      return done(null, false, { 
        message: 'Acceso restringido solo a usuarios del dominio @jasu.us' 
      });
    }
    
    // Buscar usuario existente
    let user = await User.findByGoogleId(profile.id);
    
    if (user) {
      // Actualizar última conexión
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    // Buscar por email en caso de que sea un usuario existente sin Google ID
    user = await User.findByEmail(email);
    
    if (user) {
      // Asociar Google ID al usuario existente
      user.googleId = profile.id;
      user.lastLogin = new Date();
      
      // Actualizar información si no está completa
      if (!user.profilePicture && profile.photos.length > 0) {
        user.profilePicture = profile.photos[0].value;
      }
      
      await user.save();
      return done(null, user);
    }
    
    // Crear nuevo usuario
    const newUser = await User.create({
      googleId: profile.id,
      email: email,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profilePicture: profile.photos.length > 0 ? profile.photos[0].value : null,
      lastLogin: new Date()
    });
    
    return done(null, newUser);
  } catch (error) {
    console.error('Error en autenticación Google:', error);
    return done(error, null);
  }
}));

// Configuración de JWT
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.userId, {
      include: ['card']
    });
    
    if (user && user.isActive) {
      return done(null, user);
    }
    
    return done(null, false);
  } catch (error) {
    console.error('Error en verificación JWT:', error);
    return done(error, false);
  }
}));

// Serialización para sesiones (aunque usaremos principalmente JWT)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 