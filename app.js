//Carregando Modulos
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
const LocalStrategy = require('passport-local').Strategy;


//Config

//Session
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

//Public
app.use(express.static('public'));

//Conexão com Banco   
const db = require('./Models/db');
const User = require('./Models/User');
const Profissional = require('./Models/Profissional');
const Servicos = require('./Models/Servicos');
const Horario = require('./Models/Horario');
const Evento = require('./Models/Evento');

//Middleware
app.use((req, res, next) => {
    res.locals.sucess_msg = req.flash("sucess_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

//Passport
passport.use(new LocalStrategy({ 
    usernameField: 'emailConfirma', // Campo do formulário para o email
    passwordField: 'senhaConfirma' // Campo do formulário para a senha
}, async (email, senha, done) => {
    try {
        // Encontre o usuário pelo email
        const user = await User.findOne({ where: { EMAIL: email } });

        // Se o usuário não existir, retorne false
        if (!user) {
            return done(null, false, { message: 'Email ou senha incorretos' });
        }

        console.log('Senha fornecida:', senha);
        console.log('Senha armazenada no banco de dados:', user.SENHA);

        // Compare a senha fornecida com a senha armazenada no banco de dados
        const isMatch = await bcrypt.compare(senha, user.SENHA);
        console.log('Resultado da comparação de senha:', isMatch);

        // Se as senhas não corresponderem, retorne false
        if (!isMatch) {
            return done(null, false, { message: 'Email ou senha incorretos' });
        }

        // Se tudo estiver correto, retorne o usuário
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.ID); // Use um identificador único do usuário, como o ID do banco de dados
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id); // Recupere o usuário do banco de dados usando o ID
        if (!user) {
            return done(new Error('Usuário não encontrado'));
        }
        // Se o usuário for encontrado, passe-o para a função de retorno de chamada do Passport
        done(null, user);
    } catch (err) {
        done(err); // Se houver algum erro ao recuperar o usuário, passe-o para a função de retorno de chamada
    }
});

app.post('/user/login', passport.authenticate('local', {
    failureRedirect: '/user/login', // Redireciona de volta para a página de login em caso de falha no login
    failureFlash: true // Permite flash messages para mostrar erros de autenticação
}), (req, res) => {
    res.redirect('/user/' + req.user.NOME);
});


// Middleware para verificar se o usuário está autenticado
function verificaAutenticacao(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).json({ error: 'Não autenticado' });
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
    const { start, end, service, professional, horario } = req.body;
    try {
        const userDetailsResponse = await fetch('/user/details');
        const userDetails = await userDetailsResponse.json();
        
        const { ID } = userDetails;
        
        // Criando o evento com o nome do usuário
        const novoEvento = await Evento.create({ title: ID, start, end, service, professional, horario });
        
        res.json(novoEvento);
        next();
    } catch (error) { 
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
        return redirect('./');
    }
});

//Calendar Admin
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

//Gera PDf
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

//Rotas USER

//Rotas GET

// Rota para obter os detalhes do usuário logado
app.get('/user/details', async (req, res) => {
    try {
        console.log('req.user:', req.user);

        const userId = req.user ? req.user.ID : null; // Adicionado null check

        if (userId) {
            res.json({ id: userId });
        } else {
            // Se o ID do usuário não estiver presente, envie uma mensagem de erro
            res.status(400).json({ error: 'ID do usuário não encontrado' });
        }
    } catch (error) {
        // Em caso de erro, envie uma resposta de erro
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

  
  // Iniciar o servidor (adapte a porta conforme necessário)
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

app.get('/perfil', verificaAutenticacao, (req, res) => {
    // Recupere os dados do usuário da sessão
    const user = req.user; 

    // Agora você pode usar os dados do usuário para personalizar a página
    res.send(`Bem-vindo ao seu perfil, ${user.nome}!`);
});

app.get('/', async (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.get('/user', async (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
});

app.get('/user/login', async (req, res) => {
    res.sendFile(__dirname + "/src/cad_login.html")
});

app.get('/user/:nome', async (req, res) => {
    const nomeUsuario = req.params.nome;
    // Verifique se o usuário atual é o mesmo do nome na URL
    if (req.user && req.user.NOME === nomeUsuario) {
        // Se sim, envie o arquivo HTML
        res.sendFile(__dirname + "/src/tela_indexSession.html");
    }
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

//Rotas POST

app.post('/add', async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.senhaUsuario, 10);
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
        SENHA: hashedPassword,
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
app.post('/atualizar-situacao', async (req, res) => {
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

