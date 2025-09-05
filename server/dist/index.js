"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const explain_1 = __importDefault(require("./routes/explain"));
const health_1 = __importDefault(require("./routes/health"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const logger = (0, logger_1.createLogger)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Compression and parsing middleware
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Logging middleware
app.use((0, morgan_1.default)('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
}));
// Rate limiting
app.use(rateLimiter_1.rateLimiter);
// Routes
app.use('/api/health', health_1.default);
app.use('/api/explain', explain_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});
// Start server
app.listen(PORT, () => {
    logger.info(`🚀 Algorithmic Insights API server running on port ${PORT}`);
    logger.info(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    logger.info(`🤖 Ollama URL: ${process.env.OLLAMA_URL || 'http://localhost:11434'}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
//# sourceMappingURL=index.js.map