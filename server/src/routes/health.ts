import express, { Request, Response } from 'express'
import { createLogger } from '../utils/logger'

const router = express.Router()
const logger = createLogger()

// Health check endpoint
router.get('/', (req: Request, res: Response) => {
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
  }
  
  logger.info('Health check requested')
  res.json(healthInfo)
})

export default router
