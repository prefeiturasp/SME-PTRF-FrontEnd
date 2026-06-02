import { useMutation } from "@tanstack/react-query";
import { postCancelarRetificacaoPaa } from "../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { getErrorMessage } from "../../../../../../utils/obtemMsgErroAxios";

export const usePostCancelarRetificacaoPaa = () => {
  const mutationPost = useMutation({
    mutationFn: ({ paaUuid }) => {
      return postCancelarRetificacaoPaa(paaUuid);
    },
    onSuccess: () => {
      toastCustom.ToastCustomSuccess("Retificação cancelada com sucesso.");
    },
    onError: (err) => {
      const mensagemErro = getErrorMessage(
        err,
        "Ocorreu um erro ao tentar cancelar a retificação.",
      );
      toastCustom.ToastCustomError(mensagemErro);
    },
  });
  return { mutationPost };
};
