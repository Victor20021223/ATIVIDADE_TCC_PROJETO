const localStrategy = require("passport-local").Strategy;
const sequelize = require("../Models/db");
const db = require("../Models/db");
const bcrypt = require('bcryptjs');

//Model de User
require("../Models/User")
const User = db.model('users');

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'EMAIL', passwordField: 'SENHA'}, (EMAIL, SENHA, done) =>{

        User.findOne({EMAIL: EMAIL}).then((User) =>{
            if(User){
                return done(null, false, {message: "Essa conta não existe"})
            }

            bcrypt.compare(SENHA, User.SENHA, (erro, batem) =>{
                if(batem){
                    return done(null, User)
                }else{
                    return done(null, false, {message:"Senha Incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((User, done) =>{
        done(null, User.ID)
    })

    passport.deserializeUser((ID, done) =>{
        User.findById(ID,(err, User) =>{
            done(err, User)
        })
    })
}