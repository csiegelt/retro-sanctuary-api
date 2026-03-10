import express from "express";
import { User } from "../models/Users";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
    const nuevoUsuarioData = req.body;
    try {
        const nuevoUsuario = new User(nuevoUsuarioData);
        
        // Hashear la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password, salt);
        
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el usuario',
            error: error.message
        });
    }
});

export default router;

