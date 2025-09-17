import { ASSOCIACAO_UUID, DADOS_DA_ASSOCIACAO } from "../services/auth.service";
import { visoesService } from "../services/visoes.service";

export const getUuidAssociacao = () => {
  try {
    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
    
    if (visao_selecionada === "UE") {
      return localStorage.getItem(ASSOCIACAO_UUID);
    } else if (visao_selecionada === "DRE") {
      const dadosDaAssociacao = JSON.parse(localStorage.getItem(DADOS_DA_ASSOCIACAO));
      return dadosDaAssociacao?.dados_da_associacao?.uuid || null;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao obter UUID da associação:", error);
    return null;
  }
};

export const getDadosAssociacao = () => {
  try {
    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
    
    if (visao_selecionada === "UE") {
      const uuid = localStorage.getItem(ASSOCIACAO_UUID);
      return uuid ? { uuid } : null;
    } else if (visao_selecionada === "DRE") {
      const dadosDaAssociacao = JSON.parse(localStorage.getItem(DADOS_DA_ASSOCIACAO));
      return dadosDaAssociacao?.dados_da_associacao || null;
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao obter dados da associação:", error);
    return null;
  }
};
