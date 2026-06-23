/**
 * BORAVIVER VIAGENS - Controlador de Viagens e Links (controllers/travelcontrollers.js)
 * Ano: 2026
 * Funcionalidade: Isolamento da regra de negócios para manipulação de ativos de turismo.
 */

// Se você estiver importando um cliente Supabase customizado no backend, importaria aqui:
// const supabase = require('../config/supabaseClient');

/**
 * Recupera e filtra todos os links operacionais ativos (Passagens, Hospedagens, Pacotes)
 * GET /api/v1/travel/links
 */
const obterLinksViagem = async (req, res) => {
    const { categoria } = req.query;

    try {
        // Mock estruturado simulando o retorno exato de uma consulta ao Supabase
        // query: supabase.from('travel_links').select('*').eq('status', true)
        let dadosLinks = [
            { id: 1, tipo: 'PASSAGEM', nome: 'Voo Executivo Paris AirFrance', url: 'https://www.airfrance.com.br', status: true },
            { id: 2, tipo: 'HOSPEDAGEM', nome: 'Maldivas Overwater Resort', url: 'https://www.booking.com', status: true },
            { id: 3, tipo: 'PACOTE', nome: 'EuroTrip Premium 2026', url: 'https://www.decolar.com', status: true }
        ];

        // Aplica filtro reativo caso o frontend envie uma categoria na URL (?categoria=PASSAGEM)
        if (categoria) {
            dadosLinks = dadosLinks.filter(link => link.tipo === categoria.toUpperCase());
        }

        return res.status(200).json({
            success: true,
            total_resultados: dadosLinks.length,
            data: dadosLinks
        });

    } catch (error) {
        console.error('[Erro Controlador Viagem]:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Falha interna ao processar a listagem de links de viagem.'
        });
    }
};

/**
 * Registra uma nova simulação realizada por um cliente logado para fins de auditoria
 * POST /api/v1/travel/simulate
 */
const registrarSimulacao = async (req, res) => {
    const { item_nome, quantidade, valor_total, usuario_id } = req.body;

    // Validação primária de payload
    if (!item_nome || !valor_total) {
        return res.status(400).json({
            success: false,
            message: 'Dados obrigatórios ausentes para persistência da simulação.'
        });
    }

    try {
        // Registro simulado da inserção no banco de dados (Supabase tables)
        const novaSimulacao = {
            id: "uuid-gerado-pelo-banco",
            usuario_id: usuario_id || null,
            item_nome,
            quantidade: quantidade || 1,
            valor_total,
            criado_em: new Date()
        };

        return res.status(201).json({
            success: true,
            message: 'Simulação computada com sucesso no ecossistema.',
            data: novaSimulacao
        });

    } catch (error) {
        console.error('[Erro Registro Simulação]:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Erro crítico ao registrar métricas de simulação.'
        });
    }
};

module.exports = {
    obterLinksViagem,
    registrarSimulacao
};