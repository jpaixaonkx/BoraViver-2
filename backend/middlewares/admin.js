/**
 * BORAVIVER VIAGENS - Middleware de Proteção Admin (middlewares/admin.js)
 * Ano: 2026
 * Funcionalidade: Barreira de segurança para validação de nível de acesso (RBAC).
 */

/**
 * Interceptador Autônomo de Segurança Administrativa
 */
const verificarPrivilegiosAdmin = (req, res, next) => {
    // 1. Captura a role enviada nos headers (Injetada pelo frontend ou gateway)
    const userRole = req.headers['x-user-role']; 
    const authHeader = req.headers.authorization;

    // 2. Validação primária: Existe intenção de autenticação?
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            error_code: 'AUTH_TOKEN_MISSING',
            message: 'Acesso negado. Token de autenticação não fornecido no cabeçalho.'
        });
    }

    // 3. Validação secundária baseada em Regras de Acesso (RBAC)
    if (!userRole || userRole !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            error_code: 'INSUFFICIENT_PRIVILEGES',
            message: 'Acesso proibido. Esta rota é restrita para administradores do sistema.'
        });
    }

    // Se passou por todas as checagens, libera para o próximo controlador/rota
    next();
};

export default verificarPrivilegiosAdmin;