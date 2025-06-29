import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    profilePicture: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
    versionKey: false
});

export const User = model('User', userSchema);

export default User;