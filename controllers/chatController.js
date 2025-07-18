const path = require('path');
const fs = require('fs');

exports.saveChat = (req, res) => {
    const chatRecords = req.body;
    const filePath = path.join(__dirname, '..', 'public', 'data', 'chat_records.json');
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
};