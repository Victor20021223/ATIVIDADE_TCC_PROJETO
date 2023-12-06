//Carregando Modulos
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

//Config
app.use(express.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//Conexão com Banco 
const db = require('./Models/db');
const User = require('./Models/User');
const Empresa = require('./Models/empresa');

//Public
app.use(express.static('public'));

//Rotas USER
app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.get('/user', async (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.get('/user/login', async (req, res) => {
    res.sendFile(__dirname + "/src/cad_login.html")
});

app.get('/user/login/add', async (req, res) => {
    res.sendFile(__dirname + "/src/cad_CadastroUsuario.html")
});

app.post('/add', async (req, res) => {
    await User.create({
        NOME:req.body.nomeUsuario,
        CELULAR:req.body.celularUsuario,
        EMAIL:req.body.emailUsuario,
        SENHA:req.body.senhaUsuario,
        GENERO:req.body.generoUsuario
    })
    res.sendFile(__dirname+"/src/index.html")
    
});

app.get('/user/meusplanos', async (req, res) => {
    res.sendFile(__dirname + "/src/MeusPlanos.html")
});

app.get('/user/sobrenos', async (req, res) => {
    res.sendFile(__dirname + "/src/SobreNos.html")
});


app.get('/user/addEmpresa', async (req, res) => {
    res.sendFile(__dirname + '/src/CadastroEmpresa.html')
});

//Rotas ADMIN
app.get('/admin/empresa', async (req, res) => {
    res.sendFile(__dirname + '/src/ControleEmpresa.html')
});

app.get('/admin/profissional', async (req, res) => {
    res.sendFile(__dirname + '/src/empresaProfissionais.html')
});
//Outros
const PORT = 8080
app.listen(PORT, () => {
    console.log("Servidor Rodando!!!")
});