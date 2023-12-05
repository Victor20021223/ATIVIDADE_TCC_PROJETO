//Carregando Modulos
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');

//Config
const mysql = require('mysql');

//Conexão com Banco 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: '123456',
    database: 'sistema'
});

connection.connect(function(err){
    if(err){
        console.log("Erro de conexão"+err.stack);
        return;
    }

    console.log("Conexão as ID"+ connection.threadId);
});

//Query
connection.query('SELECT * FROM users', function(err, rows, fields){
    if(!err){
        console.log('Resultado:', rows);
    }else{
        console.log('Erro ao realizar consulta');
    }
});

//Public
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));

//Rotas
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.get('/user', (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.get('/user/login', (req, res) => {
    res.sendFile(__dirname + "/src/login.html")
});

app.get('/user/login/add', (req, res) => {
    res.sendFile(__dirname+"/src/CadastroUsuario.html")
});

app.get('/user/meusplanos', (req, res) => {
    res.sendFile(__dirname + "/src/MeusPlanos.html")
});

app.get('/user/sobrenos', (req, res) => {
    res.sendFile(__dirname+"/src/SobreNos.html")
});

app.get('/user/addEmpresa', (req, res) =>{
    res.sendFile(__dirname+'/src/CadastroEmpresa.html')
})
//Outros
const PORT = 8080
app.listen(PORT, () => {
    console.log("Servidor Rodando!!!")
});