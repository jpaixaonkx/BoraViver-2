/**
 * BORAVIVER VIAGENS - Roteador de Autenticação (routes/auth.js)
 */

import express from 'express';
const router = express.Router();

// Importação desestruturada limpa
import { verificarPerfilUsuario, processarWebhookSincronia } from '../controllers/authcontrollers.js';

const verificarSessaoJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Acesso negado. Token ausente ou malformado.' 
        });
    }
    next();
};

router.post('/verify-role', verificarSessaoJWT, verificarPerfilUsuario);
router.post('/webhook-sync', processarWebhookSincronia);

export default router;