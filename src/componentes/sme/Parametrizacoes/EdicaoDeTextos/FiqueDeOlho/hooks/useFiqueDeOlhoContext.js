import { useContext } from 'react';
import { FiqueDeOlhoContext } from '../context/FiqueDeOlho';

/**
 * Hook para acessar o contexto de Fique de Olho
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Fique de Olho
 */
export const useFiqueDeOlhoContext = () => {
  const context = useContext(FiqueDeOlhoContext);

  if (!context) {
    throw new Error('useFiqueDeOlhoContext deve ser usado dentro de um FiqueDeOlhoProvider');
  }

  return context;
};
