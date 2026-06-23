/**
 * BORAVIVER VIAGENS - Roteador Administrativo Protegido (routes/admin.js)
 */

import express from 'express';
const router = express.Router();

// Importações com padrão ESM (lembrando do .js)
import adminController from '../controllers/admincontrollers.js';
import exigirAdmin from '../middlewares/admin.js';

// Aplica a barreira de segurança global do middleware
router.use(exigirAdmin);

// Endpoints mapeados para o controlador
router.get('/analytics-summary', adminController.obterResumoAnalitico);
router.get('/audit-logs', adminController.obterLogsAuditoria);

export default router;