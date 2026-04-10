const getUnidadeKey = () => {
    try {
        // Carrega sob demanda para evitar ciclo de import na inicializacao dos storages.
        const { visoesService } = require('../visoes.service');
        const dados_usuario_logado = visoesService.getDadosDoUsuarioLogado()
        
        if (!dados_usuario_logado.unidade_selecionada.uuid) return 'sem_unidade';

        return `unidade_${dados_usuario_logado.unidade_selecionada.uuid}`;
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
        const atualizado = { ...resto, [unidadeKey]: value };
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

    return { getItem, setItem, removeItem };
};
