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
        "Remoção do tipo de crédito efetuado com sucesso.",
        "O tipo de crédito foi removido do sistema com sucesso."
      );
      navigate("/parametro-tipos-receita");
    },
    onError: (e) => {
      if (e.response && e.response.data && e.response.data.mensagem) {
        const errorMsg = e.response.data.mensagem;
        toastCustom.ToastCustomError(errorMsg);
      } else {
        toastCustom.ToastCustomError(
          "Houve um erro ao tentar excluir tipo de crédito."
        );
      }
    },
  });

  return { mutationDelete };
};
