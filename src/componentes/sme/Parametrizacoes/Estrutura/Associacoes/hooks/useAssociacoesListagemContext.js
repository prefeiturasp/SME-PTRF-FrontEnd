import { useContext } from 'react';
import { AssociacaoListagemContext } from '../context/AssociacaoListagem';

/**
 * Hook para acessar o contexto da listagem de associações.
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto da listagem de associações.
 */
export const useAssociacaoListagemContext = () => {
  const context = useContext(AssociacaoListagemContext);

  if (!context) {
    throw new Error('useAssociacaoListagemContext deve ser usado dentro de um AssociacaoListagemProvider');
  }

  return context;
};
