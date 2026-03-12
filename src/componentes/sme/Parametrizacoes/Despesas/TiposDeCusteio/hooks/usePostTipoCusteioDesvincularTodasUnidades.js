import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTipoCusteioDesvincularTodasUnidades } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePostTipoCusteioDesvincularTodasUnidades = () => {
  const queryClient = useQueryClient();

  const mutationPost = useMutation({
    mutationFn: (UUID) => {
      return postTipoCusteioDesvincularTodasUnidades(UUID);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tipos-custeio"]).then();     
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Erro ao desvincular todas as unidades.");
    },
  });
  return { mutationPost };
};
