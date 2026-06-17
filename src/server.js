import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public')));
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;
