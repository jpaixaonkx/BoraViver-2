/**
 * BORAVIVER VIAGENS - Controlador de Autenticação (controllers/authcontrollers.js)
 * Ano: 2026
 */

export const verificarPerfilUsuario = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: 'O parâmetro de e-mail é estritamente obrigatório.' 
        });
    }

    try {
        const isAdmin = email.endsWith('@boraviverviagens.com.br');
        const roleAtribuida = isAdmin ? 'ADMIN' : 'CLIENT';

        return res.status(200).json({
            success: true,
            authenticated: true,
            user: { email, role: roleAtribuida, status: 'Active' }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
};

export const processarWebhookSincronia = async (req, res) => {
    const { event, table } = req.body;
    console.log(`[Webhook Core] Evento [${event}] na tabela [${table}].`);
    return res.status(200).json({ success: true, message: 'Sincronização efetuada.' });
};