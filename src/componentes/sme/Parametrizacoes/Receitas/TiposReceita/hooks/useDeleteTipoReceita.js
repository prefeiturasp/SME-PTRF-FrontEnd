import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useNavigate } from "react-router-dom-v5-compat";

export const useDeleteTipoReceita = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutationDelete = useMutation({
    mutationFn: (uuid) => {
      return deleteTipoReceita(uuid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tipos-receita"]).then();
      toastCustom.ToastCustomSuccess(
        "Sucesso!",
        "Tipo de crédito excluído com sucesso."
      );
      navigate("/parametro-tipos-receita");
    },
    onError: (e) => {
      if (e.response && e.response.data && e.response.data.mensagem) {
        const errorMsg = e.response.data.mensagem;
        toastCustom.ToastCustomError(errorMsg);
      }
    },
  });

  return { mutationDelete };
};
