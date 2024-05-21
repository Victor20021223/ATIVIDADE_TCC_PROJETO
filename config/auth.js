const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs'); // Certifique-se de ter o bcrypt instalado e configurado

const User = require('../Models/User'); // Atualize o caminho conforme necessário

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email', // Nome do campo do formulário para o nome de usuário (ou email, como preferir)
        passwordField: 'password' // Nome do campo do formulário para a senha
    }, async (email, password, done) => {
        try {
            // Encontrar usuário por email
            const user = await User.findOne({ where: { email: email } });
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
