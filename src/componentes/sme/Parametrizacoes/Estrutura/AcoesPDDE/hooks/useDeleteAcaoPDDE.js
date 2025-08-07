import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAcoesPDDE } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteAcao = (
    setModalForm,
    setErroExclusaoNaoPermitida,
    setShowModalInfoExclusaoNaoPermitida
) => {
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteAcoesPDDE(uuid);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries(['acoes']).then();
            setModalForm({open: false})
            toastCustom.ToastCustomSuccess(
                "Sucesso.", 
                response.detail || "A Ação PDDE foi removida do sistema com sucesso."
            )
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.mensagem){
                setErroExclusaoNaoPermitida(e.response.data.mensagem);
                setShowModalInfoExclusaoNaoPermitida(true)
            } else {
                const errorDetail = e.response.data.detail
                toastCustom.ToastCustomError("Ops!", errorDetail || "Houve um erro ao tentar completar ação.");
            }
        },
    });

    return { mutationDelete };
}
