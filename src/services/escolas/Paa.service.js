import api from "../api";
import { TOKEN_ALIAS } from "../auth.service";

export const downloadPdfLevantamentoPrioridades = async (associacao_uuid) => {
  try {
    const response = await api.get(
      `/api/paa/download-pdf-levantamento-prioridades/`,
      {
        params: {
          associacao_uuid,
        },
        responseType: 'blob',
        timeout: 30000,
        headers: {
          'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `levantamento_prioridades_paa.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro no download do PDF:", error);
    return error.response;
  }
};
