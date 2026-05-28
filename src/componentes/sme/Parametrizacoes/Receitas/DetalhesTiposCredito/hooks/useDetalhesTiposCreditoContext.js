import { useContext } from 'react';
import { DetalhesTipoCreditoContext } from '../context/DetalhesTiposCredito';

/**
 * Hook para acessar o contexto de Detalhes de Tipos de Crédito
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Detalhes de Tipos de Crédito
 */
export const useDetalhesTiposCreditoContext = () => {
  const context = useContext(DetalhesTipoCreditoContext);
  
  if (!context) {
    throw new Error('useDetalhesTipoCreditoContext deve ser usado dentro de um DetalhesTipoCreditoProvider');
  }
  
  return context;
};