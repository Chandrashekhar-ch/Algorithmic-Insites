import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { createLogger } from '../utils/logger'

const logger = createLogger()

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body
  })

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.errors,
      code: 'VALIDATION_ERROR'
    })
  }

  // Axios errors (from Ollama requests)
  if ((error as any).isAxiosError) {
    const axiosError = error as any
    
    if (axiosError.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Unable to connect to Ollama service',
        code: 'OLLAMA_CONNECTION_ERROR'
      })
    }
    
    if (axiosError.response?.status === 404) {
      return res.status(503).json({
        error: 'Model Not Found',
        message: 'The requested AI model is not available',
        code: 'MODEL_NOT_FOUND'
      })
    }
    
    return res.status(502).json({
      error: 'External Service Error',
      message: 'Error communicating with AI service',
      code: 'EXTERNAL_SERVICE_ERROR'
    })
  }

  // Default error response
  const statusCode = (error as any).statusCode || 500
  return res.status(statusCode).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : error.message,
    code: 'INTERNAL_ERROR'
  })
}
