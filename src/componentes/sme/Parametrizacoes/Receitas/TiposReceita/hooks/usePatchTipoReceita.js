import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useNavigate } from "react-router-dom-v5-compat";

export const usePatchTipoReceita = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutationPatch = useMutation({
    mutationFn: ({ UUID, payload }) => {
      return patchTipoReceita(UUID, payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tipos-receita"]).then();
      toastCustom.ToastCustomSuccess(
        "Edição do tipo de crédito realizado com sucesso.",
        "O tipo de crédito foi editado no sistema com sucesso."
      );
      navigate("/parametro-tipos-receita");
    },
    onError: (e) => {
      toastCustom.ToastCustomError(
        "Houve um erro ao tentar fazer essa atualização."
      );
    },
  });
  return { mutationPatch };
};
