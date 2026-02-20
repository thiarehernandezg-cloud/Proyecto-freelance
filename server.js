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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// SOLO ESTE BLOQUE POST DEBE EXISTIR
app.post('/enviar-contacto', async (req, res) => {
    const { nombre, telefono, email, mensaje } = req.body;
    console.log("🚀 Intento de envío recibido de:", nombre);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"${nombre}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `Nuevo mensaje de contacto de ${nombre}`,
        text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\nMensaje: ${mensaje}`
    };

    try {
        console.log(" Intentando enviar correo a Gmail...");
        await transporter.sendMail(mailOptions);
        console.log(" ¡Correo enviado exitosamente!");
        res.send('<h1>¡Mensaje enviado con éxito! Revisa tu bandeja de entrada.</h1>');
    } catch (error) {
        console.log(" ERROR CRÍTICO:", error);
        res.status(500).send('<h1>Hubo un error al enviar el mensaje.</h1>');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});