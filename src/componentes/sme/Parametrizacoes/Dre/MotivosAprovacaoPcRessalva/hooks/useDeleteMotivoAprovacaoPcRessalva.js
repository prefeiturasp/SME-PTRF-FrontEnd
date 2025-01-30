import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMotivoAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteMotivoAprovacaoPcRessalva = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(MotivosAprovacaoPcRessalvaContext);

    const mutationDelete = useMutation({
        mutationFn: (uuidMotivoAprovacaoPcRessalva) => {
            return deleteMotivoAprovacaoPcRessalva(uuidMotivoAprovacaoPcRessalva);
        },
        onSuccess: () => {
            console.log("Motivo de PC aprovada com ressalva apagado com sucesso. TODO6");
            // Refaz a lista de motivos de PC aprovada com ressalva
            queryClient.invalidateQueries(['motivos-aprovacao-pc-ressalva']).then();
            // Mensagens
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Exclusão do motivo de PC aprovada com ressalva realizada com sucesso', `O motivo de PC aprovada com ressalva foi excluído com sucesso.`);
        },
        onError: (error) => {
            if (error && error.response && error.response.data && error.response.data.mensagem) {
                toastCustom.ToastCustomError('Erro ao apagar o motivo de PC aprovada com ressalva', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao apagar o motivo de PC aprovada com ressalva', `Não foi possível apagar o motivo de PC aprovada com ressalva`)
            }
            console.log("Erro ao apagar o motivo de rejeição", error.response);
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
