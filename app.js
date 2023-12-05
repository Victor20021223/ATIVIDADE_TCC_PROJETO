//Carregando Modulos
const express = require('express');
const app = express();
const path = require("path");


//Config
app.use

//Conexão com Banco 
const db = require('./Models/db');
const User = require('./Models/User');

//Public
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));

//Rotas USER
app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.get('/user', async (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.get('/user/login', async (req, res) => {
    res.sendFile(__dirname + "/src/login.html")
});

app.get('/user/login/add', async (req, res) => {
    res.sendFile(__dirname + "/src/CadastroUsuario.html")
});

app.post('/user/login/cadastrar', async (req, res) => {
    console.log(req.body);

    await User.create(req.body)
        .then(() => {
            return res.json({
                erro: false,
                mensagem: "Usuario cadastrado com sucesso"
            })
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Usuario não cadastrado com sucesso"
            });
        });
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