/**
 * BORAVIVER VIAGENS - Configuração do Cliente Supabase (config/supabase.js)
 * Ano: 2026
 * Funcionalidade: Inicialização e exportação do SDK oficial para persistência de dados.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 1. Extração das credenciais protegidas via variáveis de ambiente (.env)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// 2. Validação crítica de segurança na inicialização do servidor
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ [Erro Crítico]: Variáveis SUPABASE_URL ou SUPABASE_KEY não foram detectadas no arquivo .env!');
    process.exit(1); // Encerra a execução da aplicação para evitar falhas em cascata
}

/**
 * Instância unificada do cliente Supabase.
 * Configurada com opções otimizadas para persistência e pooling de conexões estáveis.
 */
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false, // Desabilitado no backend para evitar sobreposição de sessões entre clientes distintos
        autoRefreshToken: false
    }
});

console.log('🔌 [Supabase Client]: Conexão injetada e pronta para operações relacionais.');

module.exports = supabase;