import User from '../models/user.model.js';
import logger from '../utils/logger.js';

export const whoAmI = async (req, res) => {
    const currentUser = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        message: 'Authenticated user info',
        user: currentUser
    });
};

export const getAllUsers = async (req, res) => {
    const userId = req.user.id;
    const currentUser = await User.findById(userId);

    if (!currentUser || currentUser.role !== 'admin') return res.status(401).json({ message: 'Unauthorized: You are not an admin' });
    const users = await User.find().select('-password').select('-password');
    return res
        .status(200)
        .json({
            message: 'All users fatched successfully',
            users
        });
};

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Invalid user ID format' });
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({
            message: 'User fatched successfully',
            user
        });
    } catch (error) {
        logger.error('Get user by id error: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createUser = (req, res) => { }

export const updateUser = (req, res) => { }

export const deleteUser = async (req, res) => {
    const currentUser = await User.findById(req.user.id);
    await currentUser.deleteOne();
    res.clearCookie('jwt');
    res.status(200).json({ message: 'User deleted successfully' });
};
