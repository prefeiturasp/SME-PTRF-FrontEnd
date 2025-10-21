import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { vincularUnidadesTipoCusteio } from "../../../../../../../../services/sme/Parametrizacoes.service";
import { useDispatch } from "react-redux";
import { CustomModalConfirm } from "../../../../../../../Globais/Modal/CustomModalConfirm";

export const useVincularUnidade = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationVincularUnidadeEmLote = useMutation({
    mutationFn: ({ uuid, unidadeUUID }) => {
      return vincularUnidadesTipoCusteio(uuid, { unidade_uuids: unidadeUUID });
    },
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries(["unidades-vinculadas-tipo-custeio"]);
      queryClient.invalidateQueries(["unidades-nao-vinculadas-tipo-custeio"]);
      toastCustom.ToastCustomSuccess("Sucesso!", response.mensagem);
    },
    onError: (error) => {
      CustomModalConfirm({
        dispatch,
        title: "Restrição do tipo de despesa de custeio",
        message: error.response.data.mensagem,
        cancelText: "Ok",
        dataQa: "modal-restricao-vincular-unidade-ao-tipo-de-despesa-custeio-em-lote",
      });
    },
  });

  return { mutationVincularUnidadeEmLote };
};
