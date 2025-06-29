import jwt from 'jsonwebtoken';
import loadAppConfig from '../configs/configLoader.js';

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided, Please log in' });

        const config = await loadAppConfig();
        const decoded = jwt.verify(token, config.jwt_secret);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default verifyToken;