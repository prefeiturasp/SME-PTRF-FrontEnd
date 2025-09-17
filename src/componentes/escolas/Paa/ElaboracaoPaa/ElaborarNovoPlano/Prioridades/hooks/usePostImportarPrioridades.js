import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postImportarPrioridades } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostImportarPrioridades = (onClose) => {

  const queryClient = useQueryClient();

  const mutationImportarPrioridades = useMutation({
    mutationFn: ({ uuid_paa_atual, uuid_paa_anterior }) => postImportarPrioridades(uuid_paa_atual, uuid_paa_anterior),
    
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess(`Prioridades importadas com sucesso.`);
      queryClient.invalidateQueries(["prioridades"]);
      queryClient.invalidateQueries(["prioridades-resumo"]);
      onClose && onClose();
    },
    onError: (e) => {
      const mensagemDeErro = e?.response?.data?.mensagem || "Houve um erro ao importar prioridades.";
      toastCustom.ToastCustomError(mensagemDeErro);
      console.error(e)
    },
  });

  return { mutationImportarPrioridades };
};
