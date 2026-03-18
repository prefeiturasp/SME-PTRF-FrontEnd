import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTipoCusteioVincularTodasUnidades } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostTipoCusteioVincularTodasUnidades = () => {
  const queryClient = useQueryClient();

  const mutationPost = useMutation({
    mutationFn: (UUID) => {
      return postTipoCusteioVincularTodasUnidades(UUID);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tipos-custeio"]).then();
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
