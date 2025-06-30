import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import logger from '../utils/logger.js';

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        logger.error('Get users for sidebar error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        logger.error('Get messages error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const newMessage = await Message.create(
            {
                senderId,
                receiverId,
                text
            }
        );

        await newMessage.save();

        res.status(201).json(newMessage);

    } catch (error) {
        logger.error('Send message error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}