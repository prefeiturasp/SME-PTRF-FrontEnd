import { useContext } from 'react';
import { MotivosAprovacaoPcRessalvaContext } from '../context/MotivosAprovacaoPcRessalva';

/**
 * Hook para acessar o contexto de Motivos de Aprovação de PC com Ressalvas
 * Facilita o acesso às propriedades e funções do contexto
 * @returns {Object} - Retorna o contexto de Motivos de Aprovação de PC com Ressalvas
 */
export const useMotivosAprovacaoPcRessalvaContext = () => {
  const context = useContext(MotivosAprovacaoPcRessalvaContext);
  
  if (!context) {
    throw new Error('useMotivosAprovacaoPcRessalvaContext deve ser usado dentro de um MotivosAprovacaoPcRessalvaProvider');
  }
  
  return context;
};
