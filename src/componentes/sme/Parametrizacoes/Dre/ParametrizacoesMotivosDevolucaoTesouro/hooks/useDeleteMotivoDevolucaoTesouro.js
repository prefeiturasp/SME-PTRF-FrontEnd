import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMotivoDevolucaoTesouro } from "../../../../../../services/MotivosDevolucaoTesouro.service";
import { useContext } from "react";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteMotivoDevolucaoTesouro = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(MotivosDevolucaoTesouroContext);

    const mutationDelete = useMutation({
        mutationFn: (uuidMotivoDevolucaoTesouro) => {
            return deleteMotivoDevolucaoTesouro(uuidMotivoDevolucaoTesouro);
        },
        onSuccess: () => {
            console.log("Motivo devolução ao tesouro apagado com sucesso. TODO6");
            // Refaz a lista de motivos de devolução ao tesouro
            queryClient.invalidateQueries(['motivos-devolucao-tesouro-list']).then();
            // Mensagens
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Exclusão do motivo de devolução ao tesouro realizada com sucesso', `O motivo de devolução ao tesouro foi excluído com sucesso.`);
        },
        onError: (error) => {
            if (error && error.response && error.response.data && error.response.data.mensagem) {
                toastCustom.ToastCustomError('Erro ao apagar o motivo devolução ao tesouro', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao apagar o motivo devolução ao tesouro', `Não foi possível apagar o motivo de devolução ao tesouro`)
            }
            console.log("Erro ao apagar o motivo de rejeição", error.response);
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
