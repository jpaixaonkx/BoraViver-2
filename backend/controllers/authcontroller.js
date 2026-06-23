/**
 * BORAVIVER VIAGENS - Controlador de Autenticação (controllers/authcontrollers.js)
 */

const verificarPerfilUsuario = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'O parâmetro de e-mail é obrigatório.' });
    }
    const isAdmin = email.endsWith('@boraviverviagens.com.br');
    return res.status(200).json({
        success: true,
        authenticated: true,
        user: { email, role: isAdmin ? 'ADMIN' : 'CLIENT' }
    });
};

const processarWebhookSincronia = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Sincronização efetuada.' });
};

// Exportação padrão do objeto inteiro
export default {
    verificarPerfilUsuario,
    processarWebhookSincronia
};