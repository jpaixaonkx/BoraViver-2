/**
 * BORAVIVER VIAGENS - Controlador do Painel Administrativo (controllers/admincontrollers.js)
 * Ano: 2026
 * Funcionalidade: Consolidação de analíticos, relatórios e logs de segurança.
 */

/**
 * Agrega e resume as métricas financeiras e de cliques em tempo real
 * GET /api/v1/admin/analytics-summary
 */
const obterResumoAnalitico = async (req, res) => {
    try {
        // Mock analítico simulando consultas complexas (ex: SUM, COUNT) no Supabase.
        // Em produção, consultaria as tabelas 'simulations' e 'travel_links'.
        const dadosResumo = {
            periodo: "Junho 2026",
            faturamento_estimado_diario: 4250.00,
            total_simulacoes_acumuladas: 142,
            conversao_whatsapp_cliques: 89,
            grafico_cronologico: {
                labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
                faturamento: [1200, 2100, 1800, 3400, 4250, 5100, 4800],
                simulacoes: [22, 34, 19, 45, 52, 68, 61]
            },
            grafico_canais: {
                labels: ["Passagens", "Hospedagens", "Pacotes"],
                cliques: [45, 28, 16]
            }
        };

        return res.status(200).json({
            success: true,
            data: dadosResumo
        });
    } catch (error) {
        console.error('[Erro Controlador Admin - Analytics]:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Erro interno ao consolidar dados de performance operacional.'
        });
    }
};

/**
 * Retorna a trilha de auditoria e segurança de ações críticas tomadas no sistema
 * GET /api/v1/admin/audit-logs
 */
const obterLogsAuditoria = async (req, res) => {
    try {
        // Lista cronológica simulando ações registradas por administradores
        const logsAuditoria = [
            { 
                id: 101, 
                acao: "UPDATE_COMPANY_SETTINGS", 
                autor: "diretoria@boraviverviagens.com.br", 
                detalhes: "Alteração do número central do WhatsApp de vendas.",
                timestamp: new Date(Date.now() - 1800000) // 30 minutos atrás
            },
            { 
                id: 102, 
                acao: "INSERT_PROMOTION", 
                autor: "diretoria@boraviverviagens.com.br", 
                detalhes: "Lançamento da oferta relâmpago 'Maldivas Summer Experience'.",
                timestamp: new Date(Date.now() - 7200000) // 2 horas atrás
            }
        ];

        return res.status(200).json({
            success: true,
            total_registros: logsAuditoria.length,
            logs: logsAuditoria
        });
    } catch (error) {
        console.error('[Erro Controlador Admin - Logs]:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Falha crítica ao recuperar trilha de auditoria.'
        });
    }
};

export default { obterResumoAnalitico, obterLogsAuditoria };