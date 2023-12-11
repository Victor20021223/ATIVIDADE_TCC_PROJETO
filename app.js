//Carregando Modulos
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const pdf = require('pdfkit');
const fs = require('fs');
const moment = require('moment');
require("./config/auth")(passport);


//Config

//Session
app.use(session({
    secret: "SistemaAgenda20231203",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Conexão com Banco 
const db = require('./Models/db');
const User = require('./Models/User');
const Profissional = require('./Models/Profissional');
const Servicos = require('./Models/Servicos');
const Horario = require('./Models/Horario');
const Evento = require('./Models/Evento');

//Public
app.use(express.static('public'));



//Middleware
app.use((req, res, next) => {
    res.locals.sucess_msg = req.flash("sucess_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
});

//Funcao
function verificaAutenticacao(req, res, next) {
    // Verificar se o usuário está autenticado
    if (req.session && req.session.usuario) {
        return next(); // O usuário está autenticado, continue
    } else {
        return res.redirect('/login'); // Redirecione para a página de login se não estiver autenticado
    }
}

//Calendar
app.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao obter eventos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});
// Rota para criar um novo evento
app.post('/eventos', async (req, res, next) => {
    const { title, start, end, service, professional, horario } = req.body;
    try {
        const novoEvento = await Evento.create({ title, start, end, service, professional, horario });
        res.json(novoEvento);
        next();
    } catch (error) {
        console.error('Erro ao criar evento:', error); 
        res.status(500).json({ erro: 'Erro interno do servidor' });   
        return redirect('./'); // Assuming you have a route handler for redirect  
    }
});

//Gera PDf
app.get('/relatorioAgenda/list', async (req, res) => {
    // Crie um novo documento PDF
    const doc = new pdf();

    // Defina o nome do arquivo de saída
    const fileName = 'relatorio_eventos.pdf';

    // Configuração do cabeçalho HTTP para o navegador entender que é um arquivo PDF
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Pipe o conteúdo do documento PDF diretamente para a resposta HTTP
    doc.pipe(res);

    // Adicione conteúdo ao documento PDF
    doc.fontSize(16).text('Relatório de Eventos', { align: 'center' });
    doc.moveDown();

    try {
        // Buscar eventos no banco de dados usando Sequelize
        const eventos = await Evento.findAll();
      
        eventos.forEach(evento => {

            const servico = Servicos.findOne({ where: { ID: evento.eventService } });
            const professional = Profissional.findOne({ where: { ID: evento.eventProfessional } });
            const horario = Horario.findOne({ where: { ID: evento.eventHorario } });

            doc.fontSize(12).text(`Título: ${evento.title}`);
            doc.fontSize(12).text(`Serviço: ${servico.DESCRICAO}`);  
            doc.fontSize(12).text(`Profissional: ${professional.NOME}`);
            doc.fontSize(12).text(`Horários: ${horario.HORA_LIVRE}`);
            doc.moveDown();
        });
      
        // Finalize o documento PDF
        doc.end();
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).send('Erro interno do servidor'); 
      }
    });
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

app.post('/user/login/sync', async (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login",
        failureFlash: true
    })(req, res, next)
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

app.get('/agendar', async (req, res) => {
    res.sendFile(__dirname + '/src/index.html')
});

//Rotas POST
app.post('/add', async (req, res) => {

    var erros = []

    if (!req.body.emailUsuario || typeof req.body.emailUsuario == undefined || req.body.emailUsuario == null) {
        erros.push({ text: "Nome inválido" })
    }

    if (!req.body.emailUsuario || typeof req.body.emailUsuario == undefined || req.body.emailUsuario == null) {
        erros.push({ text: "Senha inválida" })
    }

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

app.get('/admin/horarios', async (req, res) => {
    res.sendFile(__dirname + '/src/empresaHorarios.html')
})

app.get('/admin/addServico', async (req, res) => {
    res.sendFile(__dirname + '/src/cad_cadastroServico.html')
});

app.get('/admin/addProfissional', async (req, res) => {
    res.sendFile(__dirname + '/src/cad_cadastroProfissional.html')
});

app.get('/admin/addHorario', async (req, res) => {
    res.sendFile(__dirname + '/src/cad_cadastroHorario.html')
});

app.get('/admin/relatorio', async (req, res) => {
    res.sendFile(__dirname + '/src/Relatorios.html')
});

app.get('/relatorioAgenda', async (req, res) => {
    res.sendFile(__dirname + '/src/agendaList.html')
});

app.get('/admin/profissional/list', async (req, res) => {
    await Profissional.findAll().then((dataProfissional) => {
        return res.json({
            erro: false,
            dataProfissional
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum valor encontrado para pagina"
        })
    })
});

app.get('/admin/servicos/list', async (req, res) => {
    await Servicos.findAll().then((dataServicos) => {
        return res.json({
            erro: false,
            dataServicos
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum valor encontrado para pagina"
        })
    })
});

app.get('/addHorario/hora', async (req, res) => {
    await Horario.findAll().then((dataHorario) => {
        return res.json({
            erro: false,
            dataHorario
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum valor encontrado para pagina"
        })
    })
});

//Rotas POST
app.post('/addProfissional', async (req, res) => {
    await Profissional.create({
        NOME: req.body.NomeProfissional,
        FUNCAO: req.body.Funcao,
        CONTATO: req.body.Contato,
        SITUACAO: 'A'
    })
    res.sendFile(__dirname + '/src/empresaProfissionais.html')
});

app.post('/addServico', async (req, res) => {
    await Servicos.create({
        DESCRICAO: req.body.descricao,
        SOBRE: req.body.Sobre,
        VALOR: req.body.valor,
        SITUACAO: 'A'
    })
    res.sendFile(__dirname + '/src/empresaServicos.html')
});

app.post('/addHorario/hora', async (req, res) => {
    await Horario.create({
        HORA_LIVRE: req.body.HorariosDiponiveis,
    })
    res.sendFile(__dirname + '/src/empresaHorarios.html')

});

//Outros
const PORT = 8080
app.listen(PORT, () => {
    console.log("Servidor Rodando!!!")
});

//Query

