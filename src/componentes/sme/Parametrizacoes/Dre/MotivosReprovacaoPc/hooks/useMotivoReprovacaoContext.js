import { useContext } from 'react';
import { MotivosReprovacaoPcContext } from '../context/MotivosReprovacaoPc';

/**
 * Hook para acessar o contexto de Motivos de Reprovação de PC
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Motivos de Reprovação de PC
 */
export const useMotivosReprovacaoPcContext = () => {
  const context = useContext(MotivosReprovacaoPcContext);
  
  if (!context) {
    throw new Error('useMotivosReprovacaoPcContext deve ser usado dentro de um MotivosReprovacaoPcProvider');
  }
  
  return context;
};
