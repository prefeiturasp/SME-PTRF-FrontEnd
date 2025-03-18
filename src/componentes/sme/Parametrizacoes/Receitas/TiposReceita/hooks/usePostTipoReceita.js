import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { useNavigate } from "react-router-dom-v5-compat";

export const usePostTipoReceita = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutationPost = useMutation({
    mutationFn: ({ payload }) => {
      return postTipoReceita(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tipos-receita"]).then();
      toastCustom.ToastCustomSuccess(
        "Sucesso!",
        "Tipo de crédito cadastrado com sucesso."
      );
      navigate(`/edicao-tipo-de-credito/${data.uuid}`);
    },
    onError: (e) => {
      toastCustom.ToastCustomError(
        "Houve um erro ao tentar fazer essa atualização."
      );
    },
  });
  return { mutationPost };
};
