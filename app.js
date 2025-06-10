import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import __dirname from './utils.js'
import path from "path"
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));


// Ruta para contacto
app.post('/contacto', async (req, res) => {
    const { nombre, email, mensaje } = req.body;

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MI_CORREO,
        pass: process.env.MI_PASS,
    },
    });


    try {
        await transporter.sendMail({
            from: email,
            to: process.env.MI_CORREO,
            subject: `Mensaje de ${nombre}`,
            html: `<div>
            <h1>Mensaje</h1>
            ${mensaje}
            </div>`,
        });

        res.status(200).json({ mensaje: 'Mensaje enviado' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al enviar' });
    }
});

// Ruta fallback
app.get('/*splat', (req, res, next)=>{
  try {    
        res.sendFile(path.resolve(__dirname, 'public/index.html'));
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});

