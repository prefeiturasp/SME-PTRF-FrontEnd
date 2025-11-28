import { useCallback, useState } from "react";
import api from "../../../../../services/api";
import { TOKEN_ALIAS } from "../../../../../services/auth.service";
import { getDownloadArquivoFinal, getStatusGeracaoDocumentoPaa } from "../../../../../services/escolas/Paa.service";

const authHeader = () => ({
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    "Content-Type": "application/json",
  },
});

export const useDocumentoFinalPaa = () => {
  const [statusDocumento, setStatusDocumento] = useState({});
  const [statusCarregando, setStatusCarregando] = useState({});
  const [downloadEmAndamento, setDownloadEmAndamento] = useState(null);
  const [visualizacaoEmAndamento, setVisualizacaoEmAndamento] = useState(null);

  const carregarStatusDocumento = useCallback(async (paaUuid) => {
    if (!paaUuid) return;
    try {
      setStatusCarregando((prev) => ({ ...prev, [paaUuid]: true }));
      const result = await getStatusGeracaoDocumentoPaa(paaUuid);
      setStatusDocumento((prev) => ({
        ...prev,
        [paaUuid]: result,
      }));
    } catch (error) {
      console.error("Erro ao obter status do documento final do PAA:", error);
    } finally {
      setStatusCarregando((prev) => ({ ...prev, [paaUuid]: false }));
    }
  }, []);

  const baixarDocumentoFinal = useCallback(async (paaUuid) => {
    if (!paaUuid) return;
    try {
      setDownloadEmAndamento(paaUuid);
      await getDownloadArquivoFinal(paaUuid);
    } catch (error) {
      console.error("Erro ao baixar o documento final do PAA:", error);
    } finally {
      setDownloadEmAndamento(null);
    }
  }, []);

  const obterUrlDocumentoFinal = useCallback(async (paaUuid) => {
    if (!paaUuid) return null;
    setVisualizacaoEmAndamento(paaUuid);
    try {
      const response = await api.get(`/api/paa/${paaUuid}/documento-final/`, {
        responseType: "blob",
        timeout: 30000,
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
  }, []);

  const revogarUrlDocumento = useCallback((url) => {
    if (url) {
      window.URL.revokeObjectURL(url);
    }
  }, []);

  return {
    statusDocumento,
    statusCarregando,
    downloadEmAndamento,
    visualizacaoEmAndamento,
    carregarStatusDocumento,
    baixarDocumentoFinal,
    obterUrlDocumentoFinal,
    revogarUrlDocumento,
  };
};
