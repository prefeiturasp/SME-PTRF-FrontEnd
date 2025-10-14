import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { desvincularUnidadesTipoCusteio } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { CustomModalConfirm } from "../../../../../../../Globais/Modal/CustomModalConfirm";

export const useDesvincularUnidade = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationDesvincularUnidadeEmLote = useMutation({
    mutationFn: ({ uuid, unidadeUUID }) => {
      return desvincularUnidadesTipoCusteio(uuid, { unidade_uuids: unidadeUUID });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(["unidades-vinculadas-tipo-custeio"]);
      toastCustom.ToastCustomSuccess("Sucesso!", response.mensagem);
    },
    onError: (error) => {
      CustomModalConfirm({
        dispatch,
        title: "Restrição do tipo de despesa de custeio",
        message: error.response.data.mensagem,
        cancelText: "Ok",
        dataQa: "modal-restricao-desvincular-unidade-ao-tipo-de-despesa-custeio-em-lote",
      });
    },
  });

  return { mutationDesvincularUnidadeEmLote };
};
