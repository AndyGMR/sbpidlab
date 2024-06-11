const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = 'SECRET_CODE'; // Change this to a secure secret

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    }
];

// Проміжний код для перевірки токену JWT
app.use((req, res, next) => {
    const token = req.get('Authorization');
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    if (req.user && req.user.username) {
        return res.json({
            username: req.user.username,
            logout: 'http://localhost:3000/logout'
        });
    }
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/logout', (req, res) => {
    // На стороні клієнта слід видалити токен
    res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find(user => user.login === login && user.password === password);

    if (user) {
        const token = jwt.sign({ username: user.username, login: user.login }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }

    res.status(401).send();
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
