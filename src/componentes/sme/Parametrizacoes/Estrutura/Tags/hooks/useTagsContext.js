import { useContext } from 'react';
import { TagsContext } from '../context/TagsContext';

/**
 * Hook para acessar o contexto de Tags
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Tags
 */
export const useTagsContext = () => {
  const context = useContext(TagsContext);
  
  if (!context) {
    throw new Error('useTagsContext deve ser usado dentro de um TagsContextProvider');
  }
  
  return context;
};
