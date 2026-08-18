import { useContext } from 'react';
import { AssociacaoFormularioContext } from '../context/AssociacaoFormulario';

/**
 * Hook para acessar o contexto do formulario de associações.
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto do formulario de associações.
 */
export const useAssociacoesFormularioContext = () => {
  const context = useContext(AssociacaoFormularioContext);

  if (!context) {
    throw new Error('useAssociacaoFormularioContext deve ser usado dentro de um AssociacaoFormularioProvider');
  }

  return context;
};
