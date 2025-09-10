import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import apiRouter from './routes/index.js';
import { notFound, onError } from './middlewares/error.js';

const app = express();

const allowed = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',').map(s => s.trim());

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('CORS not allowed'), false);
  },
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(compression());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/v1', apiRouter);

app.use(notFound);
app.use(onError);

export default app;
