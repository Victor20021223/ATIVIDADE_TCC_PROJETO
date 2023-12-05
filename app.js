//Carregando Modulos
const express = require('express');
const app = express();
const path = require("path");


//Config


//Conexão com Banco 
const db = require('./Models/db');
const user = require('./Models/User');

//Query
/*connection.query('SELECT * FROM users', function(err, rows, fields){
    if(!err){
        console.log('Resultado:', rows);
    }else{
        console.log('Erro ao realizar consulta');
    }
});*/

/*connection.query('INSERT  INTO users(NOME, EMAIL, SENHA, GENERO, CELULAR) VALUES ("VictorT", "teste@email", "123", "Masculino", "44997322931")',function(err, result){
    if(!err){
        console.log("Usuario cadastrado")
    }else{
        console.log("Erro ao cadastrar")
    }
});*/

/*connection.query('UPDATE users SET NOME = "TESTE" WHERE id = 1', function(err, result){
    if(!err){
        console.log("Usuario editado com sucesso")
    }else{
        console.log("Usuario não atualizado")
    }
});*/

/*connection.query('DELETE FROM users', function(err,result){
    if(!err){
        console.log("Usuario deletado")
    }else{
        console.log("Usuario não deletado")
    }
});*/


//Public
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));

//Rotas
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
    res.sendFile(__dirname+"/src/CadastroUsuario.html")
});

app.post('/user/login/novo', async (req, res) =>{
    res.send("Pagina Inicial - sistema")
});

app.get('/user/meusplanos', async (req, res) => {
    res.sendFile(__dirname + "/src/MeusPlanos.html")
});

app.get('/user/sobrenos', async (req, res) => {
    res.sendFile(__dirname+"/src/SobreNos.html")
});

app.get('/user/addEmpresa', async (req, res) =>{
    res.sendFile(__dirname+'/src/CadastroEmpresa.html')
})
//Outros
const PORT = 8080
app.listen(PORT, () => {
    console.log("Servidor Rodando!!!")
});