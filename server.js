const express = require('express');
const path = require('path');
const app = express();

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Servir archivos estáticos
app.use(express.static(__dirname));

// Middleware para servir archivos JSON
app.use('/data', express.static(path.join(__dirname, 'data')));

// Rutas específicas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/login.html'));
});

app.get('/admin/panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/panel.html'));
});

// Puerto del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
