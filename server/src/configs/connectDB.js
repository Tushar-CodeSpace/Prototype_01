import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/prototype_01');
        logger.info(`Database is Connected successfully`);
    } catch (error) {
        logger.error(`Database connection error: ${error}`);
    }
};

export default connectDB;