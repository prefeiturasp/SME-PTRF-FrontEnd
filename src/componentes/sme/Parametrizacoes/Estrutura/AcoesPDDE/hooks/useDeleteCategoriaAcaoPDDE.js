import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteCategoria = ({
    categorias,
    stateFormCategoria,
    setModalForm,
    stateFormModal,
    handleFecharFormCategoria,
    setShowModalConfirmDeleteCategoria
}) => {
    const queryClient = useQueryClient();
    const mutationDeleteCategoria = useMutation({
        mutationFn: ({categoriaUuid}) => {
            return deleteAcoesPDDECategorias(categoriaUuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categorias']).then();
            queryClient.invalidateQueries(['acoes']).then();
            toastCustom.ToastCustomSuccess(
                "Sucesso!", 
                "O Programa da Ação PDDE foi removido do sistema com sucesso."
            )
            var programa = stateFormModal.programa != stateFormCategoria.uuid ? String(stateFormModal.programa) : String(categorias.results[0].uuid)
            setModalForm({...stateFormModal, programa})
            handleFecharFormCategoria();
        },
        onError: (e) => {
            if (e.response && e.response.data && e.response.data.mensagem){
                toastCustom.ToastCustomError("Ops!", e.response.data.mensagem);
            } else {
                toastCustom.ToastCustomError("Ops!", "Houve um erro ao tentar completar ação.");
            }
            setShowModalConfirmDeleteCategoria(false);
        },
    });

    return { mutationDeleteCategoria };
}
  