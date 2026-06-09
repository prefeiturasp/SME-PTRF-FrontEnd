import { useContext } from 'react';
import { ComissoesContext } from '../context/Comissoes';

/**
 * Hook para acessar o contexto de Comissões
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Comissões
 */
export const useComissoesContext = () => {
  const context = useContext(ComissoesContext);
  
  if (!context) {
    throw new Error('useComissoesContext deve ser usado dentro de um ComissoesProvider');
  }
  
  return context;
};
