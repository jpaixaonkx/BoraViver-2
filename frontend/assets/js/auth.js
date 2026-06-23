/**
 * BORAVIVER VIAGENS - Gerenciador de Autenticação e Sessão (auth.js)
 * Ano: 2026
 * Funcionalidades: Monitoramento de sessão ativa, controle de permissões por role,
 *                  proteção de rotas cliente/admin e logout centralizado.
 */

// Inicialização segura das constantes do Supabase (Ajuste as URLs para seu ambiente produtivo)
const CONFIG_SUPABASE_URL = "https://phwmvivnrlgucomktgkw.supabase.co"; 
const CONFIG_SUPABASE_ANON_KEY = "sb_publishable_wPdVmvf5EzMGCXrjMt0eDQ_qF62zpgS";

// Garante que o cliente Supabase esteja disponível globalmente
const supabaseClient = window.supabase 
    ? window.supabase.createClient(CONFIG_SUPABASE_URL, CONFIG_SUPABASE_ANON_KEY) 
    : null;

const BoraViverAuth = {
    /**
     * Verifica o estado de login do usuário e retorna os dados do perfil estendido
     */
    async obterUsuarioAtual() {
        if (!supabaseClient) return null;

        try {
            // 1. Pega o usuário logado na sessão ativa do Supabase Auth
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
            if (authError || !user) return null;

            // 2. Busca na tabela de usuários customizada o perfil com a role (ADMIN / CLIENT)
            const { data: profile, error: profileError } = await supabaseClient
                .from('users')
                .select('id, nome, sobrenome, email, role, whatsapp')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error("Falha ao recuperar metadados do perfil estendido:", profileError);
                return null;
            }

            return profile;
        } catch (err) {
            console.error("Erro crítico na validação de sessão:", err);
            return null;
        }
    },

    /**
     * Guarda de Rotas: Garante que apenas usuários com a role correspondente acessem a página
     * @param {string} roleRequerida - 'ADMIN' ou 'CLIENT'
     */
    async protegerRota(roleRequerida) {
        const perfil = await this.obterUsuarioAtual();

        if (!perfil) {
            // Se não houver sessão ativa, expulsa imediatamente para a tela de login
            window.location.href = '/login.html';
            return;
        }

        if (roleRequerida && perfil.role !== roleRequerida) {
            // Se o nível de acesso for incompatível, redireciona para a respectiva área permitida
            if (perfil.role === 'ADMIN') {
                window.location.href = '/admin/dashboard.html';
            } else {
                window.location.href = '/client.html';
            }
        }

        // Se passar nas validações, atualiza elementos de cabeçalho comuns caso existam
        const welcomeEl = document.getElementById('welcomeUser');
        if (welcomeEl) {
            welcomeEl.textContent = `Olá, ${perfil.nome} ${perfil.sobrenome}`;
        }
    },

    /**
     * Encerra a sessão ativa de forma limpa e limpa caches locais do navegador
     */
    async efetuarLogout() {
        if (!supabaseClient) return;

        try {
            await supabaseClient.auth.signOut();
            // Limpa dados temporários de buscas salvos no navegador
            sessionStorage.removeItem('boraviver_last_search');
            // Redireciona para o login de maneira limpa
            window.location.href = '/login.html';
        } catch (err) {
            console.error("Erro ao encerrar sessão:", err);
            window.location.href = '/login.html';
        }
    }
};