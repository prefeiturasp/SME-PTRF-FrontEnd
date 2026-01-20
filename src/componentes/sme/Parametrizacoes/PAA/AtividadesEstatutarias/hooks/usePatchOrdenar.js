import { useMutation } from "@tanstack/react-query";
import { patchAtividadesEstatutariasOrdernar } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchOrdenar = () => {
  const mutationPatch = useMutation({
    mutationFn: ({ uuid, destino_uuid }) => {
      return patchAtividadesEstatutariasOrdernar(uuid, destino_uuid);
    },
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess(
        "Reordenação salva",
        "A nova ordem foi salva com sucesso!"
      );
    },
    onError: (e) => {
      if (e.response && e?.response?.data) {
        toastCustom.ToastCustomError(
          "Erro!",
          e.response.data?.mensagem ||
            e.response.data?.detail ||
            "Não foi possível reordenar atividade estatutária."
        );
      } else {
        toastCustom.ToastCustomError(
          "Erro!",
          `Não foi possível reordenar atividade estatutária.`
        );
      }
      console.error(e);
    },
  });
  return { mutationPatch };
};
