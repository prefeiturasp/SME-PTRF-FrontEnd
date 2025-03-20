import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteCategoria = (
    // setModalForm,
    // setErroExclusaoNaoPermitida,
    // setShowModalInfoExclusaoNaoPermitida
) => {
    const queryClient = useQueryClient();

    const mutationDeleteCategoria = useMutation({
        mutationFn: (uuid) => {
            return deleteAcoesPDDECategorias(uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categorias']).then();
            // setModalForm({open: false})
            toastCustom.ToastCustomSuccess(
                "Remoção da Categoria daAção PDDE efetuada com sucesso.", 
                "A Categoria da Ação PDDE foi removida do sistema com sucesso."
            )
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.mensagem){
                // setErroExclusaoNaoPermitida(e.response.data.mensagem);
                // setShowModalInfoExclusaoNaoPermitida(true)
            } else {
                toastCustom.ToastCustomError("Ops!", "Houve um erro ao tentar completar ação.");
            }
        },
    });

    return { mutationDeleteCategoria };
}
