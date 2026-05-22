import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { useNavigate } from 'react-router-dom';

export const usePostTipoReceita = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutationPost = useMutation({
    mutationFn: ({ payload }) => postTipoReceita(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tipos-receita"]);
      toastCustom.ToastCustomSuccess(
        "Tipo de receita adicionada!",
        "O tipo de receita foi adicionada ao sistema com sucesso."
      );

      if (variables.selecionar_todas) {
        navigate("/parametro-tipos-receita");
      } else {
        navigate(`/edicao-tipo-de-credito/${data.uuid}`, {
          state: { selecionar_todas: false },
        });
      }
    },
    onError: (e) => {
      if (e.response?.data?.non_field_errors) {
        toastCustom.ToastCustomError("Erro ao adicionar tipo de receita", e.response.data.non_field_errors);
      } else {
        toastCustom.ToastCustomError(
          "Erro ao adicionar tipo de receita",
          "Houve um erro ao tentar fazer essa adição."
        );
      }
    },
  });

  return { mutationPost };
};
