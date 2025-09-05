const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');  // Importar o pacote CORS para permitir requisições de outras origens
const jwt = require('jsonwebtoken');   // Biblioteca para gerar tokens JWT
const session = require('express-session');  // Gerencia sessões de usuários
const path = require('path');

const app = express();
const port = 3000;

// Configuração do CORS para permitir requisições de qualquer origem
app.use(cors());  // Permite requisições de qualquer origem
app.use(express.json());  // Permite que o servidor entenda requisições JSON
app.use(session({ secret: 'segredo', resave: false, saveUninitialized: false }));

// Configurar o middleware para processar o corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração de conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '196917',
    database: 'pratiklar'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ' + err.stack);
        return;
    }
    console.log('Conectado ao MySQL como id ' + db.threadId);
});

// 🔹 Rota para consultar pedidos pelo CPF
app.get('/pedidos/:cpf', (req, res) => {
    const { cpf } = req.params;

    const query = 'SELECT * FROM pedidos WHERE cpf = ?';
    db.query(query, [cpf], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos:', err);
            res.status(500).json({ error: 'Erro ao buscar pedidos' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Nenhum pedido encontrado para este CPF.' });
            return;
        }

        res.json(results);
    });
});

// Rota para excluir um pedido pelo ID e CPF
app.delete('/pedidos/:id/:cpf', (req, res) => {
    const { id, cpf } = req.params;

    const query = 'DELETE FROM pedidos WHERE id = ? AND cpf = ?';
    db.query(query, [id, cpf], (err, result) => {
        if (err) {
            console.error('Erro ao deletar pedido:', err);
            res.status(500).json({ error: 'Erro ao deletar pedido' });
            return;
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Pedido excluído com sucesso!' });
        } else {
            res.status(404).json({ message: 'Pedido não encontrado ou não pertence a este CPF!' });
        }
    });
});

// 🔹 Rota para atualizar um pedido pelo ID
app.put('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const { produto, fornecedor, pagamento, transportadora } = req.body;

    const query = `
        UPDATE pedidos
        SET produto = ?, fornecedor = ?, pagamento = ?, transportadora = ?
        WHERE id = ?
    `;

    db.query(query, [produto, fornecedor, pagamento, transportadora, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar pedido:', err);
            return res.status(500).json({ error: 'Erro ao atualizar o pedido' });
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Pedido atualizado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Pedido não encontrado!' });
        }
    });
});

// 🔹 Rota para buscar os dados de um pedido específico pelo ID
app.get('/pedido/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM pedidos WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedido por ID:', err);
            return res.status(500).json({ error: 'Erro ao buscar pedido' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado!' });
        }

        res.json(results[0]); // Retorna apenas o primeiro resultado (esperado 1)
    });
});



// Serve arquivos estáticos (como HTML, CSS, JS) da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota padrão para acessar a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'principal', 'principal.html'));
});


// Rota protegida (somente usuários logados podem acessar)
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.status(401).json({ loggedIn: false, message: 'Acesso negado!' });
    }
});


app.post('/usuarios', (req, res) => {
    const { nome, cpf, endereco, telefone, email, senha } = req.body;

    // Inserindo dados com a senha em texto simples (sem criptografia)
    const query = 'INSERT INTO usuarios (nome, cpf, endereco, telefone, email, senha) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, cpf, endereco, telefone, email, senha], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err);  // Log do erro do banco de dados
            res.status(500).json({ error: 'Erro ao inserir os dados' });
            return;
        }
        res.status(200).json({ message: 'Usuário criado com sucesso!' });
    });
});

app.post('/pedidos', (req, res) => {
    const { nome, cpf, endereco, telefone, produto, fornecedor, pagamento, transportadora } = req.body;
    const query = 'INSERT INTO pedidos (nome, cpf, endereco, telefone, produto, fornecedor, pagamento, transportadora) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, cpf, endereco, telefone, produto, fornecedor, pagamento, transportadora], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err);  // Log do erro do banco de dados
            res.status(500).json({ error: 'Erro ao inserir os dados' });
            return;
        }
        res.status(200).json({ message: 'Pedido enviado com sucesso!' });
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            
            // Comparando a senha fornecida com a senha armazenada (sem criptografia)
            if (senha === user.senha) {
                const token = jwt.sign({ id: user.id }, 'segredo', { expiresIn: '1h' });
                res.json({ success: true, token, user });
            } else {
                res.status(401).json({ success: false, message: 'Senha incorreta!' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
        }
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
