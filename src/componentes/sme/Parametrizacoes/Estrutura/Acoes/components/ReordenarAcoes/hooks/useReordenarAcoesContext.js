import { useContext } from 'react';
import { ReordenarAcoesContext } from '../context/ReordenarAcoesContext'; 

/**
 * Hook para acessar o contexto de Reordenar Ações
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Reordenar Ações
 */
export const useReordenarAcoesContext = () => {
  const context = useContext(ReordenarAcoesContext);
  
  if (!context) {
    throw new Error('useReordenarAcoesContext deve ser usado dentro de um ReordenarAcoesContextProvider');
  }
  
  return context;
};
