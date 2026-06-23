import express from 'express';
const router = express.Router();

// Importação dos sub-roteadores com a extensão .js obrigatória
import authRoutes from './auth.js';
import adminRoutes from './admin.js';

router.get('/status', (req, res) => {
    res.status(200).json({
        app: 'BORAVIVER VIAGENS Core API',
        version: '2.6.0',
        status: 'Operational',
        timestamp: new Date()
    });
});

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

export default router;