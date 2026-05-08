import { useContext } from 'react';
import { AbasPorRecursosContext } from '../context/Recursos';

/**
 * Hook para acessar o contexto de Recursos
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Recursos
 */
export const useAbasPorRecursosContext = () => {
  const context = useContext(AbasPorRecursosContext);
  
  if (!context) {
    throw new Error('useAbasPorRecursosContext deve ser usado dentro de um AbasPorRecursoProvider');
  }
  
  return context;
};
