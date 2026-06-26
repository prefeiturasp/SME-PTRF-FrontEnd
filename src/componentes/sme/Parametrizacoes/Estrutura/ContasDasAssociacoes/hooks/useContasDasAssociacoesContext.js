import {useContext} from 'react';
import { ContasDasAssociacoesContext } from '../context/ContasDasAssociacoesContext';

/**
 * Hook personalizado para acessar o contexto de ContasDasAssociacoes.
 * Facilita o acesso às propriedades e funções do contexto em componentes filhos.
 * @returns {object} O contexto de ContasDasAssociacoes.
 * @throws {Error} Se o hook for usado fora de um ContasDasAssociacoesProvider.
 */
export const useContasDasAssociacoesContext = () => {
    const context = useContext(ContasDasAssociacoesContext);

    if (!context) {
        throw new Error('useContasDasAssociacoesContext deve ser usado dentro de um ContasDasAssociacoesProvider');
    }

    return context;
}