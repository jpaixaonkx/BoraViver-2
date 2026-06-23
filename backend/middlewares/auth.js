/**
 * BORAVIVER VIAGENS - Middleware de Autenticação e Segurança (middlewares/auth.js)
 * Ano: 2026
 * Funcionalidade: Interceptação de requisições, validação de tokens Supabase JWT e RBAC.
 */

const { createClient } = require('@supabase/supabase-js');

// Inicializa o cliente do Supabase no escopo do backend usando as variáveis do seu arquivo .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Middleware Autenticador Global
 * Verifica a assinatura do JWT enviado pelo cliente e extrai o escopo do usuário
 */
const autenticarSessao = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Acesso negado. Token de autorização (JWT) ausente ou inválido.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Valida o token diretamente contra o provedor de identidade do Supabase Auth
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Sessão expirada ou inválida. Por favor, efetue login novamente.' 
            });
        }

        // Busca a role customizada e metadados do usuário na tabela do banco de dados public.users
        const { data: perfil, error: perfilError } = await supabase
            .from('users')
            .select('role, nome, sobrenome')
            .eq('id', user.id)
            .single();

        if (perfilError || !perfil) {
            return res.status(403).json({ 
                success: false, 
                message: 'Perfil de usuário correspondente não encontrado na base de dados.' 
            });
        }

        // Injeta os dados consolidados do usuário dentro da requisição para consumo das rotas filhas
        req.usuario = {
            id: user.id,
            email: user.email,
            role: perfil.role,
            nome: perfil.nome,
            sobrenome: perfil.sobrenome
        };

        next();
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: 'Erro interno ao processar validação de credenciais de acesso.' 
        });
    }
};

/**
 * Fabricador de Restrição de Nível de Acesso (RBAC)
 * Permite travar rotas para roles específicas de forma declarativa
 * @param {string} roleRequerida - Ex: 'ADMIN' ou 'CLIENT'
 */
const restringirAcessoA = (roleRequerida) => {
    return (req, res, next) => {
        if (!req.usuario || req.usuario.role !== roleRequerida) {
            return res.status(403).json({ 
                success: false, 
                message: `Privilégio insuficiente. Esta operação requer nível de acesso: ${roleRequerida}` 
            });
        }
        next();
    };
};

module.exports = {
    autenticarSessao,
    restringirAcessoA
};