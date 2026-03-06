import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTipoReceitaVincularTodasUnidades } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostTipoReceitaVincularTodasUnidades = () => {
  const queryClient = useQueryClient();

  const mutationPost = useMutation({
    mutationFn: (UUID) => {
      return postTipoReceitaVincularTodasUnidades(UUID);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tipos-receita"]).then();
      toastCustom.ToastCustomSuccess(
        "Vinculação de unidades",
        "Todas as unidades foram habilitadas com sucesso!",
      );
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Erro ao vincular todas as unidades.");
    },
  });
  return { mutationPost };
};
