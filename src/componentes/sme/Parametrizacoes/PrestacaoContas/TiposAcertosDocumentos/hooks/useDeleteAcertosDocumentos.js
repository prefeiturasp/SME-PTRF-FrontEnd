import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAcertosDocumentos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { AcertosDocumentosContext } from "../context/AcertosDocumentos";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteAcertosDocumentos = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(AcertosDocumentosContext);

    const mutationDelete = useMutation({
        mutationFn: (uuid) => {
            return deleteAcertosDocumentos(uuid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['acertos-documentos-list']).then();
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Remoção do tipo de acerto em documento efetuado com sucesso.', `O tipo de acerto em documento foi removido do sistema com sucesso.`);
        },
        onError: (error) => {
            let mensagem = error.response?.data?.mensagem ? error.response.data.mensagem : 'Não foi possível apagar o tipo de acerto em documento';
            toastCustom.ToastCustomError('Erro ao remover tipo de acerto em documento', mensagem)
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
