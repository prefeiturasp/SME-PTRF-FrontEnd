const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

const getUnidadeKey = () => {
    try {
        // Carrega sob demanda para evitar ciclo de import na inicializacao dos storages.
        const { visoesService } = require('../visoes.service');
        const dados_usuario_logado = visoesService.getDadosDoUsuarioLogado()
        
        if (!dados_usuario_logado.unidade_selecionada.uuid || !dados_usuario_logado?.usuario_logado?.login) return 'sem_unidade';

        return `unidade_${dados_usuario_logado.unidade_selecionada.uuid}_${dados_usuario_logado?.usuario_logado?.login}`;
    } catch {
        return 'sem_unidade';
    }
};

/**
 * Cria um storage namespaceado por unidade selecionada.
 *
 * @param {string} storageKey - Chave do localStorage onde os dados são armazenados.
 */
export const criarStoragePorUnidade = ({ storageKey } = {}) => {
    const _parseTodos = () => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            return parsed;
        } catch {
            return {};
        }
    };

    const getItem = () => {
        const unidadeKey = getUnidadeKey();
        const todos = _parseTodos();
        if (todos[unidadeKey]) return todos[unidadeKey];
        return null;
    };

    const setItem = (value) => {
        const unidadeKey = getUnidadeKey();
        const todos = _parseTodos();
        const { legado, ...resto } = todos;
        const atualizado = { ...resto, [unidadeKey]: { ...value, ultimoAcesso: Date.now() } };
        localStorage.setItem(storageKey, JSON.stringify(atualizado));
    };

    const removeItem = () => {
        const unidadeKey = getUnidadeKey();
        const todos = _parseTodos();
        const { [unidadeKey]: _, legado, ...resto } = todos;
        if (Object.keys(resto).length === 0) {
            localStorage.removeItem(storageKey);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(resto));
        }
    };

    const deleteStorage = () => {
        localStorage.removeItem(storageKey);
    }

    const clearAutomaticallyDataExpired = () => {
        const all = _parseTodos();
        const now = Date.now();
        let atualizado = { ...all };
        let hasChanges = false;

        Object.keys(all).forEach(unidadeKey => {
            const item = all[unidadeKey];
            if (item?.ultimoAcesso && now - item.ultimoAcesso > ONE_MONTH) {
                delete atualizado[unidadeKey];
                hasChanges = true;
            }
        });

        if (hasChanges) localStorage.setItem(storageKey, JSON.stringify(atualizado));
    };

    return { getItem, setItem, removeItem, deleteStorage, clearAutomaticallyDataExpired };
};
