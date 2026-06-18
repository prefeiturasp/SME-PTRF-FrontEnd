import { useContext } from 'react';
import { AcoesDasAssociacoesContext } from '../context/AcoesDasAssociacoesContext';

/**
 * Hook para acessar o contexto de Ações das Associações
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Ações das Associações
 */
export const useAcoesDasAssociacoesContext = () => {
  const context = useContext(AcoesDasAssociacoesContext);
  
  if (!context) {
    throw new Error('useAcoesDasAssociacoes deve ser usado dentro de um AcoesDasAssociacoesProvider');
  }
  
  return context;
};
