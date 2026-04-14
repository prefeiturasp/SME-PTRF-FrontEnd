import { useCallback, useState } from "react";
import api from "../../../../../services/api";
import { TOKEN_ALIAS } from "../../../../../services/auth.service";

const authHeader = () => ({
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    "Content-Type": "application/json",
  },
});

export const useDocumentoFinalPaa = () => {
  const [visualizacaoEmAndamento, setVisualizacaoEmAndamento] = useState(null);

  const chaveVisualizacaoDocumento = useCallback((paaUuid, ehRetificacao) => {
    if (!paaUuid) return null;
    return `doc:${paaUuid}:${ehRetificacao ? "True" : "False"}`;
  }, []);

  const obterUrlDocumentoFinal = useCallback(
    async (paaUuid, ehRetificacao = false) => {
      if (!paaUuid) return null;
      const chave = chaveVisualizacaoDocumento(paaUuid, ehRetificacao);
      setVisualizacaoEmAndamento(chave);
      try {
        const response = await api.get(`/api/paa/${paaUuid}/documento-final/`, {
          responseType: "blob",
          timeout: 30000,
          params: { retificacao: ehRetificacao ? "true" : "false" },
          ...authHeader(),
        });
        const contentType = response?.headers?.["content-type"] || "application/pdf";
        const blob = new Blob([response.data], { type: contentType });
        return window.URL.createObjectURL(blob);
      } catch (error) {
        console.error("Erro ao visualizar o documento final do PAA:", error);
        return null;
      } finally {
        setVisualizacaoEmAndamento(null);
      }
    },
    [chaveVisualizacaoDocumento]
  );

  const obterUrlArquivoAtaPaa = useCallback(async (ataUuid) => {
    if (!ataUuid) return null;
    setVisualizacaoEmAndamento(`ata:${ataUuid}`);
    try {
      const response = await api.get(
        `/api/atas-paa/download-arquivo-ata-paa/?ata-paa-uuid=${ataUuid}`,
        {
          responseType: "blob",
          timeout: 30000,
          ...authHeader(),
        }
      );
      const contentType = response?.headers?.["content-type"] || "application/pdf";
      const blob = new Blob([response.data], { type: contentType });
      return window.URL.createObjectURL(blob);
    } catch (error) {
      console.error("Erro ao visualizar a ata do PAA:", error);
      return null;
    } finally {
      setVisualizacaoEmAndamento(null);
    }
  }, []);

  const revogarUrlDocumento = useCallback((url) => {
    if (url) {
      window.URL.revokeObjectURL(url);
    }
  }, []);

  return {
    visualizacaoEmAndamento,
    obterUrlDocumentoFinal,
    obterUrlArquivoAtaPaa,
    chaveVisualizacaoDocumento,
    revogarUrlDocumento,
  };
};
