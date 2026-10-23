export const STORAGE_KEY_ALERTAS_PAGINAS_VISTOS = 'ALERTAS_PAGINAS_VISTOS';

const UM_MES_EM_LOCALSTORAGE = 30 * 24 * 60 * 60 * 1000;

const lerTodos = () => {
    try {
        const bruto = localStorage.getItem(STORAGE_KEY_ALERTAS_PAGINAS_VISTOS);
        return bruto ? JSON.parse(bruto) : {};
    } catch {
        return {};
    }
};

// checar se já foi lido e registrado para o usuário em localstorage
const alertaJaVisto = (login, chave) => Boolean(lerTodos()[login]?.[chave]);

const marcarAlertaComoVisto = (login, chave) => {
    try {
        const todos = lerTodos();
        const agora = Date.now();
        const vistosRecentes = Object.fromEntries(
            Object.entries(todos[login] ?? {}).filter(([, vistoEm]) => agora - vistoEm < UM_MES_EM_LOCALSTORAGE),
        );
        const atualizado = { ...todos, [login]: { ...vistosRecentes, [chave]: agora } };
        localStorage.setItem(STORAGE_KEY_ALERTAS_PAGINAS_VISTOS, JSON.stringify(atualizado));
    } catch (error) {
        console.error('Erro ao registrar alerta visto: ', error);
    }
};

export const alertaPaginaStorageService = { alertaJaVisto, marcarAlertaComoVisto };
