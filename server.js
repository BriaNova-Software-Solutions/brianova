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

// Servir archivos estáticos
app.use(express.static(__dirname));

// Middleware para servir archivos JSON de manera segura
app.use('/data', (req, res, next) => {
    if (!req.path.includes('admin_auth.json')) {
        express.static(path.join(__dirname, 'data'))(req, res, next);
    } else {
        res.status(403).send('Acceso no autorizado');
    }
});

// Rutas específicas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas del panel de administración
app.get('/admin', (req, res) => {
    res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/login.html'));
});

app.get('/admin/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/login.html'));
});

app.get('/admin/panel', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/panel.html'));
});

app.get('/admin/panel.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/panel.html'));
});

// Ruta para guardar conversaciones
app.post('/data/save-chat', (req, res) => {
    const chatRecords = req.body;
    const filePath = path.join(__dirname, 'data', 'chat_records.json');
    
    try {
        // Leer archivo existente
        let existingData = { conversations: [] };
        if (fs.existsSync(filePath)) {
            existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        
        // Actualizar conversaciones
        chatRecords.conversations.forEach(newConv => {
            const existingIndex = existingData.conversations.findIndex(conv => conv.id === newConv.id);
            if (existingIndex >= 0) {
                existingData.conversations[existingIndex] = newConv;
            } else {
                existingData.conversations.push(newConv);
            }
        });
        
        // Guardar archivo
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error al guardar chat:', error);
        res.status(500).json({ error: 'Error al guardar la conversación' });
    }
});

// Ruta 404 para cualquier otra ruta no definida
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Puerto del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
