"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
const logger = (0, logger_1.createLogger)();
// Validation schemas
const ExplainRequestSchema = zod_1.z.object({
    algorithmName: zod_1.z.string().min(1),
    currentStep: zod_1.z.object({
        id: zod_1.z.string(),
        description: zod_1.z.string(),
        data: zod_1.z.array(zod_1.z.number()),
        highlightedElements: zod_1.z.array(zod_1.z.number()).optional(),
        comparingElements: zod_1.z.array(zod_1.z.number()).optional(),
        swappingElements: zod_1.z.array(zod_1.z.number()).optional()
    }),
    context: zod_1.z.object({
        totalSteps: zod_1.z.number().optional(),
        currentStepIndex: zod_1.z.number().optional(),
        performanceMetrics: zod_1.z.object({
            comparisons: zod_1.z.number().optional(),
            swaps: zod_1.z.number().optional(),
            accesses: zod_1.z.number().optional()
        }).optional()
    }).optional()
});
// Ollama service configuration
const OLLAMA_CONFIG = {
    baseURL: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.2',
    timeout: parseInt(process.env.OLLAMA_TIMEOUT || '30000')
};
// System prompt for algorithm explanations
const SYSTEM_PROMPT = `You are a knowledgeable Computer Science professor specializing in algorithms and data structures. Your role is to provide clear, educational explanations of algorithm steps that help students understand what's happening at each stage of execution.

Guidelines for your responses:
- Keep explanations concise but informative (2-3 sentences max)
- Use technical terminology appropriately but explain complex concepts
- Focus on the specific operation happening in the current step
- Explain WHY the algorithm is performing this action
- When applicable, mention the impact on time/space complexity
- Use encouraging and educational tone
- Avoid overly verbose explanations

You will receive information about the current step of an algorithm execution, including:
- The algorithm name
- Current array state
- Elements being compared, swapped, or highlighted
- Step description
- Performance metrics

Provide an explanation that helps students understand the reasoning behind the current operation.`;
// Construct user message from algorithm context
function constructUserMessage(request) {
    const { algorithmName, currentStep, context } = request;
    let message = `Algorithm: ${algorithmName}\n`;
    message += `Current Step: ${currentStep.description}\n`;
    message += `Array State: [${currentStep.data.join(', ')}]\n`;
    if (currentStep.comparingElements && currentStep.comparingElements.length > 0) {
        const elements = currentStep.comparingElements.map(i => currentStep.data[i]);
        message += `Comparing elements: ${elements.join(' and ')} at positions ${currentStep.comparingElements.join(' and ')}\n`;
    }
    if (currentStep.swappingElements && currentStep.swappingElements.length > 0) {
        const elements = currentStep.swappingElements.map(i => currentStep.data[i]);
        message += `Swapping elements: ${elements.join(' and ')} at positions ${currentStep.swappingElements.join(' and ')}\n`;
    }
    if (currentStep.highlightedElements && currentStep.highlightedElements.length > 0) {
        const elements = currentStep.highlightedElements.map(i => currentStep.data[i]);
        message += `Highlighted elements: ${elements.join(', ')} at positions ${currentStep.highlightedElements.join(', ')}\n`;
    }
    if (context?.performanceMetrics) {
        const { comparisons, swaps, accesses } = context.performanceMetrics;
        message += `Performance so far: ${comparisons || 0} comparisons, ${swaps || 0} swaps, ${accesses || 0} array accesses\n`;
    }
    if (context?.currentStepIndex !== undefined && context?.totalSteps !== undefined) {
        message += `Progress: Step ${context.currentStepIndex + 1} of ${context.totalSteps}\n`;
    }
    message += '\nPlease explain what is happening in this step and why the algorithm is performing this operation.';
    return message;
}
// Check Ollama availability
async function checkOllamaAvailability() {
    try {
        const response = await axios_1.default.get(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
            timeout: 5000
        });
        const models = response.data.models || [];
        return models.some((model) => model.name.includes(OLLAMA_CONFIG.model));
    }
    catch (error) {
        logger.error('Ollama availability check failed:', error);
        return false;
    }
}
// Main explanation endpoint
router.post('/', async (req, res, next) => {
    try {
        // Validate request body
        const validatedData = ExplainRequestSchema.parse(req.body);
        // Check if Ollama is available
        const isAvailable = await checkOllamaAvailability();
        if (!isAvailable) {
            return res.status(503).json({
                error: 'AI Service Unavailable',
                message: 'Ollama is not running or the required model is not installed',
                code: 'OLLAMA_UNAVAILABLE'
            });
        }
        // Construct the request payload for Ollama
        const ollamaRequest = {
            model: OLLAMA_CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: constructUserMessage(validatedData)
                }
            ],
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                top_k: 40
            }
        };
        // Make request to Ollama
        const startTime = Date.now();
        const response = await axios_1.default.post(`${OLLAMA_CONFIG.baseURL}/api/chat`, ollamaRequest, {
            timeout: OLLAMA_CONFIG.timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseTime = Date.now() - startTime;
        const explanation = response.data.message?.content?.trim();
        if (!explanation) {
            return res.status(500).json({
                error: 'Empty Response',
                message: 'Ollama returned an empty response',
                code: 'EMPTY_RESPONSE'
            });
        }
        logger.info(`Generated explanation for ${validatedData.algorithmName} in ${responseTime}ms`);
        res.json({
            explanation,
            metadata: {
                algorithmName: validatedData.algorithmName,
                stepId: validatedData.currentStep.id,
                responseTime,
                model: OLLAMA_CONFIG.model
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
// Health check for Ollama
router.get('/health', async (req, res) => {
    try {
        const isAvailable = await checkOllamaAvailability();
        res.json({
            status: isAvailable ? 'available' : 'unavailable',
            ollama: {
                url: OLLAMA_CONFIG.baseURL,
                model: OLLAMA_CONFIG.model,
                available: isAvailable
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Health check failed',
            timestamp: new Date().toISOString()
        });
    }
});
exports.default = router;
//# sourceMappingURL=explain.js.map