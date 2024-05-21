const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const pdf = require('pdfkit');
const moment = require('moment');
require('./config/auth')(passport);

// Configurações

// Session
app.use(session({
    secret: "SistemaAgenda20231203",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function verificaAutenticacao(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Por favor, faça login para acessar esta página');
        res.redirect('/user/login');
    }
}

// Conexão com Banco   
const db = require('./Models/db');
const User = require('./Models/User');
const Profissional = require('./Models/Profissional');
const Servicos = require('./Models/Servicos');
const Horario = require('./Models/Horario');
const Evento = require('./Models/Evento');

// Public
app.use(express.static('public'));

// Middleware
app.use((req, res, next) => {
    res.locals.sucess_msg = req.flash("sucess_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Calendar
app.get('/eventos', async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (error) {
        console.error('Erro ao obter eventos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

app.post('/eventos', async (req, res, next) => {
    const { title, start, end, service, professional, horario } = req.body;
    try {
        const novoEvento = await Evento.create({ title, start, end, service, professional, horario });
        res.json(novoEvento);
        next();
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Calendar Admin
app.get('/servico/:id', async (req, res) => {
    try {
        const servico = await Servicos.findOne({ where: { ID: req.params.id } });
        res.json(servico);
    } catch (error) {
        console.error('Erro ao obter informações do serviço:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

app.get('/profissional/:id', async (req, res) => {
    try {
        const profissional = await Profissional.findOne({ where: { ID: req.params.id } });
        res.json(profissional);
    } catch (error) {
        console.error('Erro ao obter informações do serviço:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

app.get('/horario/:id', async (req, res) => {
    try {
        const horarios = await Horario.findOne({ where: { ID: req.params.id } });
        res.json(horarios);
    } catch (error) {
        console.error('Erro ao obter informações do serviço:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Gera PDF
app.get('/relatorio-eventos', async (req, res) => {
    const doc = new pdf();

    const fileName = 'relatorio_eventos.pdf';
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(16).text('Relatório de Eventos', { align: 'center' });
    doc.moveDown();

    try {
        const eventos = await Evento.findAll();

        // Adiciona cabeçalho à tabela
        doc.font('Helvetica-Bold').fontSize(12);
        
        const startY = doc.y;
        const columnWidth = 100;

        doc.text('Título', 75, startY, { width: columnWidth, align: 'center' });
        doc.text('Serviço', 175, startY, { width: columnWidth, align: 'center' });
        doc.text('Profissional', 275, startY, { width: columnWidth, align: 'center' });
        doc.text('Horários', 375, startY, { width: columnWidth, align: 'center' });
        doc.text('Data', 475, startY, { width: columnWidth, align: 'center' });
        doc.moveDown();

        // Adiciona dados à tabela
        doc.font('Helvetica').fontSize(12);

        for (const evento of eventos) {
            const service = await Servicos.findOne({ where: { ID: evento.service } });
            const profissional = await Profissional.findOne({ where: { ID: evento.professional } });
            const horario = await Horario.findOne({ where: { ID: evento.horario } });

            const rowY = doc.y;
            
            doc.text(evento.title, 75, rowY, { width: columnWidth, align: 'center' });
            doc.text(service ? service.DESCRICAO : 'N/A', 175, rowY, { width: columnWidth, align: 'center' });
            doc.text(profissional ? profissional.NOME : 'N/A', 275, rowY, { width: columnWidth, align: 'center' });
            doc.text(horario ? horario.HORA_LIVRE : 'N/A', 375, rowY, { width: columnWidth, align: 'center' });
            doc.text(evento.start, 475, rowY, { width: columnWidth, align: 'center' });

            doc.moveDown();
        }

        // Finaliza o documento PDF
        doc.end();
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Rotas USER

// Rotas GET
app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});

app.get('/user', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});

app.get('/user/login', async (req, res) => {
    res.sendFile(__dirname + "/src/cad_login.html");
});

app.post('/user/login/sync', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

app.get('/user/login/add', async (req, res) => {
    res.sendFile(__dirname + "/src/cad_CadastroUsuario.html");
});

app.get('/user/meusplanos', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + "/src/MeusPlanos.html");
});

app.get('/user/sobrenos', async (req, res) => {
    res.sendFile(__dirname + "/src/SobreNos.html");
});

app.get('/addEmpresa', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/cad_CadastroEmpresa.html');
});

app.get('/agendar', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/servicos', async (req, res) => {
    try {
        const servicos = await Servicos.findAll();
        res.json(servicos);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

app.get('/profissional', async (req, res) => {
    try {
        const profissional = await Profissional.findAll();
        res.json(profissional);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

app.get('/horarios', async (req, res) => {
    try {
        const horarios = await Horario.findAll();
        res.json(horarios);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Rotas POST
app.post('/add', async (req, res) => {
    const { nomeUsuario, celularUsuario, emailUsuario, senhaUsuario, generoUsuario } = req.body;
    let erros = [];

    if (!emailUsuario) {
        erros.push({ text: "E-mail inválido" });
    }

    if (!senhaUsuario) {
        erros.push({ text: "Senha inválida" });
    }

    if (erros.length > 0) {
        res.sendFile(__dirname + "/src/cad_CadastroUsuario.html", { erros });
    } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senhaUsuario, salt);

        await User.create({
            NOME: nomeUsuario,
            CELULAR: celularUsuario,
            EMAIL: emailUsuario,
            SENHA: hash,
            GENERO: generoUsuario
        });
        res.sendFile(__dirname + "/src/index.html");
    }
});

// Rotas ADMIN

// Rotas GET
app.get('/admin', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/ControleEmpresa.html');
});

app.get('/admin/profissional', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/empresaProfissionais.html');
});

app.get('/admin/servicos', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/empresaServicos.html');
});

app.get('/admin/horarios', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/empresaHorarios.html');
});

app.get('/admin/addServico', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/cad_cadastroServico.html');
});

app.get('/admin/addProfissional', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/cad_cadastroProfissional.html');
});

app.get('/admin/addHorario', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/cad_cadastroHorario.html');
});

app.get('/admin/relatorio', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/Relatorios.html');
});

app.get('/relatorioAgenda', verificaAutenticacao, async (req, res) => {
    res.sendFile(__dirname + '/src/agendaList.html');
});

app.get('/admin/profissional/list', verificaAutenticacao, async (req, res) => {
    try {
        const dataProfissional = await Profissional.findAll();
        res.json({
            erro: false,
            dataProfissional
        });
    } catch {
        res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum valor encontrado para pagina"
        });
    }
});

app.get('/admin/servicos/list', verificaAutenticacao, async (req, res) => {
    try {
        const dataServicos = await Servicos.findAll();
        res.json({
            erro: false,
            dataServicos
        });
    } catch {
        res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum valor encontrado para pagina"
        });
    }
});

app.get('/addHorario/hora', verificaAutenticacao, async (req, res) => {
    try {
        const dataHorario = await Horario.findAll();
        res.json({
            erro: false,
            dataHorario
        });
    } catch {
        res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum valor encontrado para pagina"
        });
    }
});

// Rotas POST
app.post('/atualizar-situacao', verificaAutenticacao, async (req, res) => {
    const { id, situacao } = req.body;

    try {
        const horario = await Horario.findByPk(id);

        if (horario) {
            horario.SITUACAO = situacao;
            await horario.save();
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Horário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar a situação do horário' });
    }
});

app.post('/addProfissional', verificaAutenticacao, async (req, res) => {
    await Profissional.create({
        NOME: req.body.NomeProfissional,
        FUNCAO: req.body.Funcao,
        CONTATO: req.body.Contato,
        SITUACAO: 'A'
    });
    res.sendFile(__dirname + '/src/empresaProfissionais.html');
});

app.post('/addServico', verificaAutenticacao, async (req, res) => {
    await Servicos.create({
        DESCRICAO: req.body.descricao,
        SOBRE: req.body.Sobre,
        VALOR: req.body.valor,
        SITUACAO: 'A'
    });
    res.sendFile(__dirname + '/src/empresaServicos.html');
});

app.post('/addHorario/hora', verificaAutenticacao, async (req, res) => {
    await Horario.create({
        HORA_LIVRE: req.body.HorariosDiponiveis,
    });
    res.sendFile(__dirname + '/src/empresaHorarios.html');
});

// Outros
const PORT = 8080;
app.listen(PORT, () => {
    console.log("Servidor Rodando!!!");
});
