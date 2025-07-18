const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para seguridad básica
app.use((req, res, next) => {
    // Prevenir acceso directo a admin_auth.json
    if (req.path.includes('admin_auth.json')) {
        return res.status(403).send('Acceso no autorizado');
    }
    next();
});

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para servir archivos JSON de manera segura
app.use('/data', (req, res, next) => {
    if (!req.path.includes('admin_auth.json')) {
        express.static(path.join(__dirname, 'public', 'data'))(req, res, next);
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});

// Rutas específicas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas del panel de administración
app.get('/admin', (req, res) => {
    res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'panel.html'));
});

app.get('/admin/panel.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'panel.html'));
});

// TODO: Modularizar rutas y controladores
// TODO: Implementar autenticación segura

// Modularización de rutas
const chatRoutes = require('./routes/chatRoutes');
app.use('/data', chatRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Ruta 404 para cualquier otra ruta no definida
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Puerto del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
