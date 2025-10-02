import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postImportarPrioridades } from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const usePostImportarPrioridades = (onClose) => {
  const queryClient = useQueryClient();

  const mutationImportarPrioridades = useMutation({
    mutationFn: ({ uuid_paa_atual, uuid_paa_anterior, confirmar }) => postImportarPrioridades(
                                                                        uuid_paa_atual, uuid_paa_anterior, confirmar),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess(data?.mensagem || `Prioridades importadas com sucesso.`);
      queryClient.invalidateQueries(["prioridades"]);
      queryClient.invalidateQueries(["prioridades-resumo"]);
      onClose && onClose();
    },
  });

  return { mutationImportarPrioridades };
};
