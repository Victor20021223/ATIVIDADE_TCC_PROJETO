const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../Models/User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'EMAIL',
        passwordField: 'SENHA'
    }, async (email, password, done) => {
        try {
            // Encontrar usuário por email
            const user = await User.findOne({ where: { EMAIL: email } });
            if (!user) {
                return done(null, false, { message: 'Endereço de email não registrado' });
            }

            // Verificar a senha
            const isMatch = await bcrypt.compare(password, user.SENHA);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Senha incorreta' });
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.ID);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
