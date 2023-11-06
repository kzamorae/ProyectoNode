import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/userModel.js';

export const register = async(req, res) => {
    try {
        const { email, password, nombre, edad } = req.body;

        // Verificar si ya existe un usuario con el mismo correo electrónico
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Ya existe un usuario con el mismo correo electrónico' });
        }

        // Nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, nombre, edad });
        await newUser.save();

        // Token de acceso
        const accessToken = jwt.sign({ userId: newUser._id }, config.secretKey);

        // Error al registrar usuario
        res.status(201).json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al registrar el usuario' });
    }
};

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el correo electrónico y la contraseña son correctos
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        if (password != user.password) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar un token de acceso
        const accessToken = jwt.sign({ userId: user._id }, config.secretKey);

        // Enviar una respuesta al cliente
        res.status(200).json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al iniciar sesión' });
    }
};

export const logout = async(req, res) => {
    try {
        const { email } = req.body;

        // Verificar el correo electrónico 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no ha iniciado sesión' });
        }

        // Enviar una respuesta al cliente
        res.status(200).json({ message: 'Sesión cerrada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al cerrar sesión' });
    }
};