const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// 1. Al entrar a la web, cargamos el portafolio (index)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/enviar-contacto', async (req, res) => {
    const { nombre, telefono, email, mensaje } = req.body;
    console.log("🚀 Intento de envío recibido de:", nombre);

 const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false // Esto ayuda a evitar bloqueos en servidores externos
        }
    });

   const mailOptions = {
        from: `"${nombre}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `🚀 Nuevo Mensaje: ${nombre}`,
        html: `
            <div style="background-color: #eceae3; padding: 40px; font-family: sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 15px; overflow: hidden; border: 1px solid #c9b6b4;">
                    <div style="background-color: #957b71; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">NUEVO CONTACTO</h1>
                    </div>
                    <div style="padding: 30px; color: #ae978a;">
                        <p>Has recibido una nueva propuesta:</p>
                        <div style="background-color: #fcfaf7; border-radius: 8px; padding: 20px; border-left: 5px solid #c9b6b4;">
                            <p><strong>Nombre:</strong> ${nombre}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Teléfono:</strong> ${telefono}</p>
                        </div>
                        <p style="margin-top: 20px;"><strong>Mensaje:</strong></p>
                        <p style="background-color: #eceae3; padding: 15px; border-radius: 5px;">${mensaje}</p>
                    </div>
                </div>
            </div>
        `
    };

    try {
        console.log(" Intentando enviar correo a Gmail...");
        await transporter.sendMail(mailOptions);
        console.log("¡Correo enviado exitosamente!");
        
        // 2. DESPUÉS de enviar el correo, mostramos la página de gracias
        res.sendFile(path.join(__dirname, 'gracias.html'));

    } catch (error) {
        console.error("❌ Error detallado:", error);
        res.status(500).send('<h1>Error al enviar el mensaje</h1>');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});