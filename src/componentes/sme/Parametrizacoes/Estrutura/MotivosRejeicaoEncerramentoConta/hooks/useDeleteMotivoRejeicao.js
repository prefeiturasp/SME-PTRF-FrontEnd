import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMotivoRejeicaoEncerramentoConta } from "../../../../../../services/MotivosRejeicaoEncerramentoConta.service";
import { useContext } from "react";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteMotivoRejeicao = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(MotivosRejeicaoContext);

    const mutationDelete = useMutation({
        mutationFn: (uuidMotivoRejeicao) => {
            return deleteMotivoRejeicaoEncerramentoConta(uuidMotivoRejeicao);
        },
        onSuccess: () => {
            console.log("Motivo rejeição apagado com sucesso.");
            // Refaz a lista de motivos de rejeição
            queryClient.invalidateQueries(['motivos-rejeicao-list']).then();
            // Mensagens
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Exclusão do motivo de rejeição de encerramento de conta realizada com sucesso', `O motivo de rejeição foi excluído com sucesso.`);
        },
        onError: (error) => {
            console.log("Erro ao apagar o motivo de rejeição", error.response);
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
