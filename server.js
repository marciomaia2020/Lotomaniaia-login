const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

let users = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (users.find(user => user.username === username)) {
        res.json({ success: false, message: 'Usuário já existe.' });
    } else {
        users.push({ username, password });
        res.json({ success: true });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Usuário ou senha incorretos.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
