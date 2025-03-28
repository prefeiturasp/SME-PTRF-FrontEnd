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
        mutationFn: ({categoriaUuid, acaoUuid}) => {
            return deleteAcoesPDDECategorias(categoriaUuid, acaoUuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categorias']).then();
            queryClient.invalidateQueries(['acoes']).then();
            toastCustom.ToastCustomSuccess(
                "Sucesso!", 
                "A Categoria da Ação PDDE foi removida do sistema com sucesso."
            )
            var categoria = stateFormModal.categoria != stateFormCategoria.id ? String(stateFormModal.categoria) : String(categorias.results[0].id)
            setModalForm({...stateFormModal, categoria})
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
  