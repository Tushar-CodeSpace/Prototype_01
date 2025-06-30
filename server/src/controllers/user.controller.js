import User from '../models/user.model.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';

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

export const updateUser = async (req, res) => {
    const userId = req.user.id;
    const { fullName, email, password } = req.body;
    const user = await User.findById(userId);
    try {

        // validate the user input
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Invalid user ID format' });
        if (email && typeof email !== 'string') return res.status(400).json({ message: 'email must be a string' });
        if (fullName && typeof fullName !== 'string') return res.status(400).json({ message: 'fullName must be a string' });

        // check the email is unique
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) return res.status(409).json({ message: 'Email already exists' });

        // update the password
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            return res
                .status(200)
                .json
                ({
                    message: 'Password updated successfully',
                    user_details: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email
                    }
                })
        }

        // update the user
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        await user.save();
        return res
            .status(200)
            .json
            ({
                message: 'User details updated successfully',
                user_details: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email
                }
            });
    } catch (error) {
        logger.error('Update user error: ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteUser = async (req, res) => {
    const currentUser = await User.findById(req.user.id);
    await currentUser.deleteOne();
    res.clearCookie('jwt');
    res.status(200).json({ message: 'User deleted successfully' });
};
