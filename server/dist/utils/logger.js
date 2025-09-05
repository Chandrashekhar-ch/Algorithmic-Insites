"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const createLogger = () => {
    return winston_1.default.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level}]: ${message}${stack ? '\n' + stack : ''}`;
        })),
        transports: [
            new winston_1.default.transports.Console(),
            new winston_1.default.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: winston_1.default.format.json()
            }),
            new winston_1.default.transports.File({
                filename: 'logs/combined.log',
                format: winston_1.default.format.json()
            })
        ]
    });
};
exports.createLogger = createLogger;
//# sourceMappingURL=logger.js.map