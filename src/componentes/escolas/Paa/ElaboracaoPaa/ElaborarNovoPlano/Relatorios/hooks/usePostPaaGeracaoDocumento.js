import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postGerarDocumentoPreviaPaa,
  postGerarDocumentoFinalPaa,
  postGerarDocumentoPreviaRetificacaoPaa,
  postGerarDocumentoFinalRetificacaoPaa,
} from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostPaaGeracaoDocumentoPrevia = ({
  onSuccessGerarDocumento = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (uuid) => {
      return await postGerarDocumentoPreviaPaa(uuid);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["paaVigente"] });
      onSuccessGerarDocumento?.()
    },
    onError: (error) => {
      if(error?.response?.data){
        toastCustom.ToastCustomError(
          "Erro!",
          error?.response?.data?.mensagem || "Falha ao gerar o documento prévia.");
      } else {
        toastCustom.ToastCustomError(
          "Erro!",
          "Ops! Houve um erro ao tentar gerar o documento prévia.");
      }
      console.error("Erro ao gerar documento prévia do PAA:", error);
    },
  });

  return mutation;
};

export const usePostPaaGeracaoDocumentoPreviaRetificacao = ({
  onSuccessGerarDocumentoRetificacao = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (uuid) => {
      return await postGerarDocumentoPreviaRetificacaoPaa(uuid);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["paaVigente"] });
      onSuccessGerarDocumentoRetificacao?.()
    },
    onError: (error) => {
      if(error?.response?.data){
        toastCustom.ToastCustomError(
          "Erro!",
          error?.response?.data?.mensagem ||
          "Falha ao gerar o documento prévia de retificação.");
      } else {
        toastCustom.ToastCustomError(
          "Erro!",
          "Ops! Houve um erro ao tentar gerar o documento prévia de retificação.");
      }
      console.error("Erro ao gerar documento prévia de retificação do PAA:", error);
    },
  });

  return mutation;
};

export const usePostPaaGeracaoDocumentoFinal = ({
  onSuccessGerarDocumento = () => {},
  onErrorGerarDocumento= () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({uuid, payload}) => {
      return await postGerarDocumentoFinalPaa(uuid, payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["paaVigente"] });
      onSuccessGerarDocumento?.()
    },
    onError: (error) => {
      if (error?.response?.data?.mensagem || error?.response?.data?.confirmar) {
        /** Captura de validações */
        onErrorGerarDocumento?.(error.response.data)
      } else {
        toastCustom.ToastCustomError(
          "Erro!", "Ops! Houve um erro ao tentar gerar o documento final."
        );
      }
      console.error("Erro ao gerar documento final do PAA:", error);

    },
  });

  return mutation;
};

export const usePostPaaGeracaoDocumentoFinalRetificacao = ({
  onSuccessGerarDocumentoRetificacao = () => {},
  onErrorGerarDocumentoRetificacao= () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({uuid, payload}) => {
      return await postGerarDocumentoFinalRetificacaoPaa(uuid, payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["paaVigente"] });
      onSuccessGerarDocumentoRetificacao?.()
    },
    onError: (error) => {
      if (error?.response?.data?.mensagem || error?.response?.data?.confirmar) {
        /** Captura de validações */
        onErrorGerarDocumentoRetificacao?.(error.response.data)
      } else {
        toastCustom.ToastCustomError(
          "Erro!", "Ops! Houve um erro ao tentar gerar o documento final de retificação."
        );
      }
      console.error("Erro ao gerar documento final de retificaçãodo PAA:", error);

    },
  });

  return mutation;
};
