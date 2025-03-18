import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const usePatchTipoReceita = () => {
  const queryClient = useQueryClient();

  const mutationPatch = useMutation({
    mutationFn: ({ UUID, payload }) => {
      return patchTipoReceita(UUID, payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tipos-receita"]).then();
      toastCustom.ToastCustomSuccess(
        "Edição salva.",
        "A edição foi salva com sucesso!"
      );
    },
    onError: (e) => {
      toastCustom.ToastCustomError(
        "Houve um erro ao tentar fazer essa atualização."
      );
    },
  });
  return { mutationPatch };
};
