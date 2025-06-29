import { Schema, model } from 'mongoose';
import logger from '../utils/logger.js';

const configSchema = new Schema({
    _id: String,
    port: Number,
    mode: String,
    jwt_secret: String
}, { collection: 'app_config' });

const Config = model('Config', configSchema);

const loadAppConfig = async () => {
    const config = await Config.findById('app_config').lean();
    if (!config) logger.error('App config not found');

    // const config = configDoc.toObject();
    delete config._id;
    return config;
};

export default loadAppConfig;