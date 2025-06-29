// server.js
import app from './app.js';
import connectDB from './configs/connectDB.js';
import loadAppConfig from './configs/configLoader.js';
import logger from './utils/logger.js';

await connectDB();
const config = await loadAppConfig();

app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
})
