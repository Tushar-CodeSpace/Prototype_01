import logger from '../utils/logger.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import loadAppConfig from '../configs/configLoader.js';

export const signupController = async (req, res) => {
    const config = await loadAppConfig();
    const { fullName, email, password } = req.body;
    try {
        // request data validation
        if (!fullName || typeof fullName !== 'string') {
            return res.status(400).json({ message: "fullName is required and must be a string" });
        }
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: "email is required and must be a string" });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: "password is required, must be a string, and at least 6 characters long" });
        }

        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // user creation
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        // generate jwt token
        const token = jwt.sign({ id: newUser._id, email }, config.jwt_secret, { expiresIn: '7d' });

        // response
        res
            .cookie('jwt', token, {
                httpOnly: true,
                secure: config.mode !== 'development',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .status(201)
            .json({
                message: `User created`,
                user_details: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    token
                }
            });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginController = async (req, res) => {
    const config = await loadAppConfig();
    const { email, password } = req.body;

    // request data validation
    if (!email || typeof email !== 'string') return res.status(400).json({ message: "email is required and must be a string" });
    if (!password || typeof password !== 'string' || password.length < 6) return res.status(400).json({ message: "password is required, must be a string, and at least 6 characters long" });

    // user check
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // password check
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Incorrect password" });

    // generate jwt token
    const token = jwt.sign({ id: user._id, email }, config.jwt_secret, { expiresIn: '7d' });

    // response
    res
        .cookie('jwt', token, {
            httpOnly: true,
            secure: config.mode !== 'development',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({
            message: `User logged in`,
            user_details: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                token
            }
        });
};

export const logoutController = (req, res) => {
    res
        .clearCookie('jwt')
        .status(200)
        .json({ message: "User logged out" });
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};