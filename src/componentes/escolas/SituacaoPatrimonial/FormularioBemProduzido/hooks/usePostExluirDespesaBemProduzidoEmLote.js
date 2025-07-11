import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postExluirDespesaBemProduzidoEmLote } from "../../../../../services/escolas/BensProduzidos.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const usePostExluirDespesaBemProduzidoEmLote = (
  setDespesasSelecionadas
) => {
  const queryClient = useQueryClient();
  const mutationPost = useMutation({
    mutationFn: ({ uuid, payload }) =>
      postExluirDespesaBemProduzidoEmLote(uuid, payload),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("Operação executada com sucesso.");
      queryClient.invalidateQueries(["bem-produzido-detail"]);
      setDespesasSelecionadas([]);
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao executar operação.");
    },
  });

  return { mutationPost };
};
