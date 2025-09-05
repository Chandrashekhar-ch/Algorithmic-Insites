"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
const logger = (0, logger_1.createLogger)();
// Health check endpoint
router.get('/', (req, res) => {
    const healthInfo = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        memory: process.memoryUsage(),
        services: {
            ollama: {
                url: process.env.OLLAMA_URL || 'http://localhost:11434',
                model: process.env.OLLAMA_MODEL || 'llama3.2'
            }
        }
    };
    logger.info('Health check requested');
    res.json(healthInfo);
});
exports.default = router;
//# sourceMappingURL=health.js.map