const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    nome:{
        type: String,
        required:true
    },
    celular:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    senha:{
        type: String,
        required:true
    },
    genero:{
        type: String,
        required:true
    }
});

mongoose.model("user", User);


