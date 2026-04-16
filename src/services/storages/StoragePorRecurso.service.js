import { recursoSelecionadoStorageService } from "./RecursoSelecionado.storage.service";

const getRecursoKey = () => {
    try {
        const raw = recursoSelecionadoStorageService.getRecursoSelecionado(); // deve mudar para buscar do service que será criado ou do hook
        if (!raw) return 'sem_recurso';
        return raw?.uuid ? `recurso_${raw.uuid}` : 'sem_recurso';
    } catch {
        return 'sem_recurso';
    }
};

/**
 * Cria um storage namespaceado por recurso selecionado.
 *
 * @param {string} storageKey - Chave do localStorage onde os dados são armazenados.
 * @param {function} [isLegadoFn] - Função que recebe o objeto parseado e retorna true
 *   se estiver no formato legado (plano). Quando fornecida, habilita fallback de leitura
 *   e limpeza automática ao escrever.
 */
export const criarStoragePorRecurso = ({ storageKey, isLegadoFn } = {}) => {
    const _parseTodos = () => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            if (isLegadoFn && isLegadoFn(parsed)) {
                return { legado: parsed };
            }
            return parsed;
        } catch {
            return {};
        }
    };

    const getItem = () => {
        const recursoKey = getRecursoKey();
        const todos = _parseTodos();
        if (todos[recursoKey]) return todos[recursoKey];
        if (isLegadoFn && todos['legado']) return todos['legado'];
        return null;
    };

    const setItem = (value) => {
        const recursoKey = getRecursoKey();
        const todos = _parseTodos();
        const { legado, ...resto } = todos;
        const atualizado = { ...resto, [recursoKey]: value };
        localStorage.setItem(storageKey, JSON.stringify(atualizado));
    };

    const removeItem = () => {
        const recursoKey = getRecursoKey();
        const todos = _parseTodos();
        const { [recursoKey]: _, legado, ...resto } = todos;
        if (Object.keys(resto).length === 0) {
            localStorage.removeItem(storageKey);
        } else {
            localStorage.setItem(storageKey, JSON.stringify(resto));
        }
    };

    return { getItem, setItem, removeItem };
};
