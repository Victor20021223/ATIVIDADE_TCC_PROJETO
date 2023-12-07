//Carregando Modulos
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");


//Config
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Conexão com Banco 
const db = require('./Models/db');
const User = require('./Models/User');
const Profissional = require('./Models/Profissional');
const Servicos = require('./Models/Servicos');
const Horario = require('./Models/Horario');

//Public
app.use(express.static('public'));

//Rotas USER

//Rotas GET
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

app.get('/user/meusplanos', async (req, res) => {
    res.sendFile(__dirname + "/src/MeusPlanos.html")
});

app.get('/user/sobrenos', async (req, res) => {
    res.sendFile(__dirname + "/src/SobreNos.html")
});


app.get('/addEmpresa', async (req, res) => {
    res.sendFile(__dirname + '/src/cad_CadastroEmpresa.html')
});

//Rotas POST
app.post('/add', async (req, res) => {
    await User.create({
        NOME: req.body.nomeUsuario,
        CELULAR: req.body.celularUsuario,
        EMAIL: req.body.emailUsuario,
        SENHA: req.body.senhaUsuario,
        GENERO: req.body.generoUsuario
    })
    res.sendFile(__dirname + "/src/index.html")
});

//Rotas ADMIN

//Rotas Get
app.get('/admin', async (req, res) => {
    res.sendFile(__dirname + '/src/ControleEmpresa.html')
});

app.get('/admin/profissional', async (req, res) => {
    res.sendFile(__dirname + '/src/empresaProfissionais.html')
});

app.get('/admin/servicos', async (req, res) => {
    res.sendFile(__dirname + '/src/empresaServicos.html') 
});

app.get('/admin/horarios', async (req, res) =>{
    res.sendFile(__dirname+'/src/empresaHorarios.html')
})

app.get('/admin/addServico', async (req, res) => {
    res.sendFile(__dirname+'/src/cad_cadastroServico.html')
});

app.get('/admin/addProfissional', async (req, res) => {
    res.sendFile(__dirname+'/src/cad_cadastroProfissional.html')
});

app.get('/admin/addHorario', async (req, res) => {
    res.sendFile(__dirname+'/src/cad_cadastroHorarios.html')
});

app.get('/admin/profissional',async (req, res) => {
    const query = 'SELECT * FROM profissionais';
    Profissional.query(query, (error, results, fields) => {
        if (error) throw error;

        res.json(results);
    });
});

app.get('/admin/servicos', async (req, res) => {
    const query = 'SELECT * FROM servicos';
    Servicos.query(query, (error, results, fields) => {
        if (error) throw error;

        res.json(results);
    });
});

//Rotas POST
app.post('/addProfissional', async (req, res) => {
    await Profissional.create({
        NOME:req.body.NomeProfissional,
        FUNCAO:req.body.Funcao,
        CONTATO:req.body.Contato, 
        SITUACAO:'A'
    }) 
    res.sendFile(__dirname+'/src/empresaPRofissionais.html')
});

app.post('/addServico', async (req, res) => {
    await Servicos.create({
        DESCRICAO:req.body.descricao,
        SOBRE:req.body.Sobre,
        VALOR:req.body.valor, 
        SITUACAO:'A'
    }) 
    res.sendFile(__dirname+'/src/empresaPRofissionais.html')
});

app.post('/addHorario', async (req, res) => {
    await Horario.create({
        DIAS_DA_SEMANA:req.body.DiaSemana,
        HORA_INICIO_EXPEDIENTE:req.body.HoraInicio,
        HORA_FIM_EXPEDIENTE:req.body.HoraFim, 
        INTERVALO_INICIO:req.body.IntervaloInicio,
        INTERVALO_FIM:req.body.IntervaloFim,
        INTERVALO_ENTRE_ATEND:req.body.IntervaloAtendimento
    })  
    res.sendFile(__dirname+'/src/empresaHorarios.html')
});

//Outros
const PORT = 8080
app.listen(PORT, () => {
    console.log("Servidor Rodando!!!")
});

//Query

