const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; // Porta do servidor Express

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'teste'
});

// Conectar ao banco de dados MySQL
function connectDatabase() {
  db.connect(err => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      setTimeout(connectDatabase, 2000); // Tentar reconectar após 2 segundos
      return;
    }
    console.log('Conectado ao banco de dados MySQL');
  });
}

connectDatabase();

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota GET para buscar dados
app.get('/dados', (req, res) => {
  const query = 'SELECT * FROM usuarios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      res.status(500).send('Erro ao buscar dados');
      return;
    }
    res.json(results);
  });
});

// Rota POST para adicionar dados
app.post('/dados', (req, res) => {
  console.log('Corpo da solicitação:', req.body); 
  const novoDado = {
    nome: req.body.nome,
    email: req.body.email
  };

  // Validação básica dos dados
  if (!novoDado.nome || !novoDado.email) {
    return res.status(400).send('Nome e email são obrigatórios');
  }

  const query = 'INSERT INTO usuarios SET ?';
  db.query(query, novoDado, (err, result) => {
    if (err) {
      console.error('Erro ao adicionar dado:', err);
      res.status(500).send('Erro ao adicionar dado');
      return;
    }
    res.send('Dado adicionado com sucesso!');
  });
});

// Rota para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
