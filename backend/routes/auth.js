/**
 * BORAVIVER VIAGENS - Roteador de Autenticação (routes/auth.js)
 */

import express from 'express';
const router = express.Router();

// Importação do objeto padrão (Garante compatibilidade máxima no ESM)
// Altere para:
import authController from '../controllers/authcontroller.js';

const verificarSessaoJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Acesso negado.' });
    }
    next();
};

// Chamada utilizando o ponto do objeto exportado
router.post('/verify-role', verificarSessaoJWT, authController.verificarPerfilUsuario);
router.post('/webhook-sync', authController.processarWebhookSincronia);

export default router;