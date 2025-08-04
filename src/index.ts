import express from "express";
import { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { ApiResponse, ErrorResponse } from "./types";

dotenv.config();

const app: Application = express();

const PORT: number = parseInt(process.env.PORT || "3000", 10);
const NODE_ENV: string = process.env.NODE_ENV || 'development';


// Security middleware

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);

app.use(
  cors({
    origin: NODE_ENV === "development" ? "*" : ["https://yourdomain.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req: Request, res: Response<ApiResponse<object>>) => {
  const response: ApiResponse<object> = {
    success: true,
    data: {
      name: 'AlgoViz API',
      version: '1.0.0',
      environment: NODE_ENV,
      nodeVersion: process.version,
      uptime: Math.floor(process.uptime()),
    },
    message: 'AlgoViz API is running successfully!',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response<ApiResponse<object>>) => {
  const response: ApiResponse<object> = {
    success: true,
    data: {
      status: 'healthy',
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      timestamp: new Date().toISOString(),
    },
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

// API info endpoint
app.get('/api/info', (req: Request, res: Response<ApiResponse<object>>) => {
  const response: ApiResponse<object> = {
    success: true,
    data: {
      title: 'AlgoViz API',
      description: 'Algorithm visualization platform for Google interview preparation',
      version: '1.0.0',
      author: 'Your Name',
      technologies: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Redis'],
      features: [
        'RESTful API design',
        'TypeScript type safety',
        'Professional error handling',
        'Security best practices',
        'Comprehensive logging',
      ],
    },
    message: 'API information retrieved successfully',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

// 404 handler for undefined routes
app.use('*', (req: Request, res: Response<ErrorResponse>) => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
      details: {
        method: req.method,
        path: req.originalUrl,
        availableEndpoints: ['/', '/health', '/api/info'],
      },
    },
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(errorResponse);
});

// Global error handler
app.use((err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: NODE_ENV === 'development' ? err.message : 'Internal server error occurred',
      details: NODE_ENV === 'development' ? { stack: err.stack } : undefined,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(errorResponse);
});

// ==========================================
// SERVER STARTUP
// ==========================================

const server = app.listen(PORT, () => {
  console.log('🚀 AlgoViz API Server Started');
  console.log('================================');
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`⚡ Node.js: ${process.version}`);
  console.log(`🔧 TypeScript: Enabled`);
  console.log('================================');
  
  if (NODE_ENV === 'development') {
    console.log('🛠️  Development mode endpoints:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   GET  http://localhost:${PORT}/api/info`);
    console.log('================================');
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;