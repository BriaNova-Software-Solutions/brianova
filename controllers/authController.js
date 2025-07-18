const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ADMIN_FILE = path.join(__dirname, '..', 'public', 'data', 'admin_auth.json');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }
    // Leer admin_auth.json
    let adminData;
    try {
        adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    } catch (err) {
        return res.status(500).json({ error: 'Error interno de autenticación' });
    }
    // Buscar usuario
    const admin = adminData.admins.find(a => a.email === email);
    if (!admin) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    // Verificar contraseña
    bcrypt.compare(password, admin.password, (err, isMatch) => {
        if (err || !isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        // Generar token JWT
        const token = jwt.sign({ email: admin.email, name: admin.name }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, name: admin.name, email: admin.email });
    });
};

// Middleware para proteger rutas
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token requerido' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
};