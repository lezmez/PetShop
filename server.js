const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const config = {
    user: 'tu_usuario',
    password: 'tu_contraseña',
    server: 'tu_servidor', // por ejemplo: 'localhost'
    database: 'PetShop',
    options: {
        encrypt: false,
        enableArithAbort: true
    }
};

sql.connect(config, err => {
    if (err) console.log(err);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const query = `INSERT INTO Usuario (username, password, email) VALUES ('${username}', '${password}', '${email}')`;

    new sql.Request().query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send('Error al registrar el usuario');
        } else {
            res.redirect('/');
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM Usuario WHERE username = '${username}' AND password = '${password}'`;

    new sql.Request().query(query, (err, result) => {
        if (err) console.log(err);

        if (result.recordset.length > 0) {
            res.redirect('/menu');
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
});

app.get('/menu', (req, res) => {
    res.sendFile(__dirname + '/public/menu.html');
});

app.get('/clientes', (req, res) => {
    res.sendFile(__dirname + '/public/clientes.html');
});

app.post('/clientes', (req, res) => {
    const { nombre, email, telefono, direccion } = req.body;
    const query = `INSERT INTO Cliente (nombre, email, telefono, direccion) VALUES ('${nombre}', '${email}', '${telefono}', '${direccion}')`;

    new sql.Request().query(query, (err, result) => {
        if (err) console.log(err);
        res.redirect('/clientes');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
