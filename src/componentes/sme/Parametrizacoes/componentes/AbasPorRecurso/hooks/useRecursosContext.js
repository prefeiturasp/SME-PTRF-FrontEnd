import { useContext } from 'react';
import { RecursosContext } from '../context/Recursos';

/**
 * Hook para acessar o contexto de Recursos
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Recursos
 */
export const useRecursosContext = () => {
  const context = useContext(RecursosContext);
  
  if (!context) {
    throw new Error('useRecursosContext deve ser usado dentro de um RecursosProvider');
  }
  
  return context;
};
