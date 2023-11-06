import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

export const getUsers = async(req, res) => {
    try {
        // Obtener todos los usuarios de la base de datos
        const users = await User.find();

        // Enviar una respuesta al cliente
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al obtener los usuarios' });
    }
};

export const getUserById = async(req, res) => {
    try {
        const { id } = req.params;

        // Buscar un usuario por su ID en la base de datos
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Enviar una respuesta al cliente
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al obtener ' });
    }
};

export const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const { email, password, nombre, edad } = req.body;

        // Buscar un usuario por su ID en la base de datos
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar
        if (email) user.email = email;
        
        if (nombre) user.nombre = nombre;
        if (edad) user.edad = edad;
        if (password) user.password = await bcrypt.hash(password, 10);
        await user.save();

        // Enviar una respuesta 
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al actualizar el usuario' });
    }
};

export const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;

        // Buscar usuario por su ID en la base de datos
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Eliminar usuario de la base de datos
        await user.deleteOne();

        // Enviar respuesta al cliente
        res.status(200).json({ message: 'Usuario eliminado correctamente: ' + user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ha ocurrido un error al eliminar el usuario' });
    }
};