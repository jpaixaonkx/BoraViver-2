/**
 * BORAVIVER VIAGENS - Servidor Central Node.js (server.js)
 * Padrão: ES Modules (import)
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // Carrega o .env automaticamente

// Equivalente ao __dirname no ecossistema ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Importação das rotas dinâmicas
import mainRouter from './routes/main.js';
app.use('/api/v1', mainRouter);
app.use('/api/travel', mainRouter); // Fallback de compatibilidade

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 BORAVIVER CORE ENGINE INITIALIZED (ESM MODE)`);
    console.log(`🛰️  Servidor rodando em: http://localhost:${PORT}`);
    console.log(`==================================================`);
});