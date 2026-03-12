import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTipoReceitaDesvincularTodasUnidades } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostTipoReceitaDesvincularTodasUnidades = () => {
  const queryClient = useQueryClient();

  const mutationPost = useMutation({
    mutationFn: (UUID) => {
      return postTipoReceitaDesvincularTodasUnidades(UUID);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tipos-receita"]).then();
      /* toastCustom.ToastCustomSuccess(
        "Vinculação de unidades",
        "Todas as unidades foram desabilitadas com sucesso!",
      ); */
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Erro ao desvincular todas as unidades.");
    },
  });
  return { mutationPost };
};
