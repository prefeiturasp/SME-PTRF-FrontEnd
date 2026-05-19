import { useContext } from 'react';
import { AbasPorRecursoContext } from '../context/Recursos';

/**
 * Hook para acessar o contexto de Recursos
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Recursos
 */
export const useAbasPorRecursoContext = () => {
  const context = useContext(AbasPorRecursoContext);
  
  if (!context) {
    throw new Error('useAbasPorRecursoContext deve ser usado dentro de um AbasPorRecursoProvider');
  }
  
  return context;
};
