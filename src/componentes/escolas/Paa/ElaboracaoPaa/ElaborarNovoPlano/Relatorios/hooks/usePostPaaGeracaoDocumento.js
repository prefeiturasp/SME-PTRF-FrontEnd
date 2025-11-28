import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postGerarDocumentoPreviaPaa, postGerarDocumentoFinalPaa } from "../../../../../../../services/escolas/Paa.service";
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

export const usePostPaaGeracaoDocumentoFinal = ({
  onSuccessGerarDocumento = () => {},
  onErrorGerarDocumento= () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (uuid) => {
      return await postGerarDocumentoFinalPaa(uuid);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["paaVigente"] });
      onSuccessGerarDocumento?.()
    },
    onError: (error) => {
      if (error?.response?.data?.mensagem){
        /** Captura de validações */
        onErrorGerarDocumento?.(error.response.data.mensagem)
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
