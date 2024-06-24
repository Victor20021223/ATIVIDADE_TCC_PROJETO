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

// Public
app.use(express.static('public'));

// Conexão com Banco   
const db = require('./Models/db');
const User = require('./Models/User');
const Profissional = require('./Models/Profissional');
const Servicos = require('./Models/Servicos');
const Horario = require('./Models/Horario');
const Evento = require('./Models/Evento');
const { model } = require('mongoose');
const { start } = require('repl');

// Middleware para mensagens flash
app.use((req, res, next) => {
    res.locals.sucess_msg = req.flash("sucess_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Configuração do Passport
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
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.ID); // Use um identificador único do usuário, como o ID do banco de dados
});

passport.deserializeUser(async (ID, done) => {
    try {
        const user = await User.findByPk(ID); // Recupere o usuário do banco de dados usando o ID
        if (!user) {
            return done(new Error('Usuário não encontrado'));
        }
        // Se o usuário for encontrado, passe-o para a função de retorno de chamada do Passport
        done(null, user);
    } catch (err) {
        done(err); // Se houver algum erro ao recuperar o usuário, passe-o para a função de retorno de chamada
    }
});

// Rota de login
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
        const eventos = await Evento.findAll({
            include: [
                {
                    model: User,
                    attributes: ['ID', 'NOME'],
                    as: 'usuario'
                },
                {
                    model: Horario,
                    attributes: ['ID', 'HORA_LIVRE'],
                    as: 'horarios'
                }
            ]
        });

        // Transformar os eventos para incluir o nome do usuário como título e o horário como start
        const eventosComTitulo = eventos.map(evento => {
            return {
                ...evento.toJSON(),
                title: evento.usuario.NOME,
                startStr: evento.horarios.HORA_LIVRE,
                endStr: evento.horarios.HORA_LIVRE,
            };
        });

        res.json(eventosComTitulo);
    } catch (error) {
        console.error('Erro ao obter eventos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// Rota para criar um novo evento
app.post('/eventos', verificaAutenticacao, async (req, res, next) => {
    // Verifique se o usuário está autenticado e o ID do usuário está disponível no Passport
    if (!req.user || !req.user.ID) {
        return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    
    const { start, end, service, professional, horario } = req.body;
    try {
        const userID = req.user.ID; // Obtenha o ID do usuário autenticado
        
        // Criando o evento com o ID do usuário
        const novoEvento = await Evento.create({ idUser: userID, start, end, service, professional, horario });
        
        res.json(novoEvento);
    } catch (error) { 
        console.error('Erro ao criar evento:', error);  
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});


//Calendar Admin
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      // Busca o usuário pelo ID no banco de dados
      const user = await User.findOne({ where: { ID: userId } });
  
      if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
  
      // Retorna os dados do usuário encontrados
      res.json(user);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });

  app.get('/servico/:id', async (req, res) => {
    const servicoId = req.params.id;
    try {
      // Busca o serviço pelo ID no banco de dados
      const servico = await Servicos.findOne({ where: { ID: servicoId } });
  
      if (!servico) {
        return res.status(404).json({ erro: 'Serviço não encontrado' });
      }
  
      // Retorna os dados do serviço encontrados
      res.json(servico);
    } catch (error) {
      console.error('Erro ao obter informações do serviço:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });


  app.get('/profissional/:id', async (req, res) => {
    const profissionalId = req.params.id;
    try {
      // Busca o profissional pelo ID no banco de dados
      const profissional = await Profissional.findOne({ where: { ID: profissionalId } });
  
      if (!profissional) {
        return res.status(404).json({ erro: 'Profissional não encontrado' });
      }
  
      // Retorna os dados do profissional encontrados
      res.json(profissional);
    } catch (error) {
      console.error('Erro ao obter informações do profissional:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });


  app.get('/horario/:id', async (req, res) => {
    const horarioId = req.params.id;
    try {
      // Busca o horário pelo ID no banco de dados
      const horario = await Horario.findOne({ where: { ID: horarioId } });
  
      if (!horario) {
        return res.status(404).json({ erro: 'Horário não encontrado' });
      }
  
      // Retorna os dados do horário encontrados
      res.json(horario);
    } catch (error) {
      console.error('Erro ao obter informações do horário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });

//Gera PDf
app.get('/relatorio-eventos', async (req, res) => {
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    const fileName = 'relatorio_eventos.pdf';
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(16).text('Relatório de Eventos', { align: 'center' });
    doc.moveDown();

    try {
        const eventos = await Evento.findAll();

        // Agrupar eventos por data
        const eventosPorData = eventos.reduce((acc, evento) => {
            const data = evento.start.split(' ')[0]; // Considera apenas a data
            if (!acc[data]) acc[data] = [];
            acc[data].push(evento);
            return acc;
        }, {});

        doc.font('Helvetica').fontSize(12);

        for (const [data, eventos] of Object.entries(eventosPorData)) {
            // Adiciona cabeçalho da data
            doc.fontSize(14).font('Helvetica-Bold').text(`Data: ${data}`, { align: 'left' });
            doc.moveDown();

            // Adiciona eventos
            doc.fontSize(12).font('Helvetica');
            for (const evento of eventos) {
                const user = await User.findOne({ where : {ID: evento.idUser}});
                const service = await Servicos.findOne({ where: { ID: evento.service } });
                const profissional = await Profissional.findOne({ where: { ID: evento.professional } });
                const horario = await Horario.findOne({ where: { ID: evento.horario } });

                doc.text(`Nome: ${user.NOME}`, { continued: true });
                doc.text(` | Serviço: ${service ? service.DESCRICAO : 'N/A'}`, { continued: true });
                doc.text(` | Profissional: ${profissional ? profissional.NOME : 'N/A'}`, { continued: true });
                doc.text(` | Horário: ${horario ? horario.HORA_LIVRE : 'N/A'}`, { continued: true });
                doc.text(` | Data: ${evento.start}`);

                doc.moveDown();
            }

            // Adiciona um espaço entre diferentes datas
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
app.get('/user/details', verificaAutenticacao, async (req, res) => {
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
    res.sendFile(__dirname + "sobrenos.html");
});


app.get('/addEmpresa', async (req, res) => {
    res.sendFile(__dirname + '/src/cad_CadastroEmpresa.html')
});

app.get('/agendar', async (req, res) => {
    res.sendFile(__dirname + '/src/index.html')
});

app.get('/servicos', async (req, res) => {
    try {
      const servicos = await Servicos.findAll({
        where: {
          SITUACAO: 'A'
        }
      });
      res.json(servicos);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });

  app.get('/profissional', async (req, res) => {
    try {
      const profissionais = await Profissional.findAll({
        where: {
          SITUACAO: 'A'
        }
      });
      res.json(profissionais);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error); 
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });

  app.get('/horarios', async (req, res) => {
    try {
      const horarios = await Horario.findAll({
        where: {
          SITUACAO: 'A'
        }
      });
      res.json(horarios);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
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

app.get('/admin/login/add', async (req, res) => {
    res.sendFile(__dirname + "/src/cad_CadastroEmpresa.html")
});

app.get('/admin/login', async (req, res) => {
    res.sendFile(__dirname + "/src/cad_loginEmpresa.html")
});

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

app.get('/admin/horarios/list', async (req, res) => {
    try {
      const dataHorario = await Horario.findAll();
      return res.json({
        erro: false,
        dataHorario
      });
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro ao buscar horários'
      });
    }
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

// Rota para atualizar um serviço por ID
app.put('/admin/servicos/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, sobre, valor, situacao } = req.body;
  
    try {
      // Verifique se o serviço com o ID especificado existe no banco de dados
      const servico = await Servicos.findByPk(id);
  
      if (!servico) {
        return res.status(404).json({ erro: 'Serviço não encontrado' });
      }
  
      // Atualize os campos do serviço com os novos dados
      servico.DESCRICAO = descricao;
      servico.SOBRE = sobre;
      servico.VALOR = valor;
      servico.SITUACAO = situacao;
  
      // Salve as alterações no banco de dados
      await servico.save();
  
      // Responda com uma mensagem de sucesso
      res.json({ sucesso: true, mensagem: 'Serviço atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      res.status(500).json({ erro: 'Erro interno do servidor ao atualizar serviço' }); 
    }
  });

  app.put('/admin/profissional/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, funcao, contato, situacao } = req.body;
  
    try {
      // Verifique se o profissional com o ID especificado existe no banco de dados
      const profissional = await Profissional.findByPk(id);
  
      if (!profissional) {
        return res.status(404).json({ erro: 'Profissional não encontrado' });
      }
  
      // Atualize os campos do profissional com os novos dados
      profissional.NOME = nome;
      profissional.FUNCAO = funcao;
      profissional.CONTATO = contato;
      profissional.SITUACAO = situacao;
  
      // Salve as alterações no banco de dados
      await profissional.save();
  
      // Responda com uma mensagem de sucesso
      res.json({ sucesso: true, mensagem: 'Profissional atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      res.status(500).json({ erro: 'Erro interno do servidor ao atualizar profissional' });
    }
  });

  app.put('/admin/horarios/:id', async (req, res) => {
    const { id } = req.params;
    const { horaLivre, situacao } = req.body;
  
    try {
      // Verifique se o horário com o ID especificado existe no banco de dados
      const horario = await Horario.findByPk(id);
  
      if (!horario) {
        return res.status(404).json({ erro: 'Horário não encontrado' });
      }
  
      // Atualize os campos do horário com os novos dados
      horario.HORA_LIVRE = horaLivre;
      horario.SITUACAO = situacao;
  
      // Salve as alterações no banco de dados
      await horario.save();
  
      // Responda com uma mensagem de sucesso
      res.json({ sucesso: true, mensagem: 'Horário atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor ao atualizar horário' });
    }
  });
  
  
//Outros
const PORT = 8080
app.listen(PORT, () => {
    console.log("Servidor Rodando!!!")
});

//Query