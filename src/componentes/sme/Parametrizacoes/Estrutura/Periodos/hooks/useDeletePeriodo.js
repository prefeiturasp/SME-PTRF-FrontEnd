import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePeriodo } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeletePeriodo = (
    setModalForm,
    setErroExclusaoNaoPermitida,
    setShowModalInfoExclusaoNaoPermitida
) => {
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: (uuidMotivoEstorno) => {
            return deletePeriodo(uuidMotivoEstorno);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['periodos']).then();
            setModalForm({open: false})
            toastCustom.ToastCustomSuccess(
                "Remoção do período efetuada com sucesso.", 
                "O período foi removido do sistema com sucesso."
            )
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.mensagem){
                setErroExclusaoNaoPermitida(e.response.data.mensagem);
                setShowModalInfoExclusaoNaoPermitida(true)
            } else {
                toastCustom.ToastCustomError("Ops!", "Houve um erro ao tentar completar ação.");
            }
        },
    });

    return { mutationDelete };
}
