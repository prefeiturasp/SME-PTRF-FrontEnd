import { useContext } from 'react';
import { AcoesContext } from '../context/AcoesContext';

/**
 * Hook para acessar o contexto de Ações
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Ações
 */
export const useAcoesContext = () => {
  const context = useContext(AcoesContext);
  
  if (!context) {
    throw new Error('useAcoesContext deve ser usado dentro de um AcoesContextProvider');
  }
  
  return context;
};
