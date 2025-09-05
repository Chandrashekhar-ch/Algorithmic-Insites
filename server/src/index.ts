import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createLogger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'
import explainRouter from './routes/explain'
import healthRouter from './routes/health'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002
const logger = createLogger()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Compression and parsing middleware
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}))

// Rate limiting
app.use(rateLimiter)

// Routes
app.use('/api/health', healthRouter)
app.use('/api/explain', explainRouter)

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  })
})

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Algorithmic Insights API server running on port ${PORT}`)
  logger.info(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  logger.info(`🤖 Ollama URL: ${process.env.OLLAMA_URL || 'http://localhost:11434'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})
