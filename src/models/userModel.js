import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true },
    nombre: { type: String, require: true },
    edad: Number
});

const User = mongoose.model('usuarios', userSchema);

export default User;