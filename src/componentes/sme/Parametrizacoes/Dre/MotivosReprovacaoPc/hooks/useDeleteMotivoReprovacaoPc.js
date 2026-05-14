import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMotivoReprovacaoPc } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useMotivosReprovacaoPcContext } from "./useMotivoReprovacaoContext";

export const useDeleteMotivoReprovacaoPc = () => {

    const queryClient = useQueryClient();
    const { handleCloseModalForm, setBloquearBtnSalvarForm } = useMotivosReprovacaoPcContext();

    const mutationDelete = useMutation({
        mutationFn: (uuidMotivoReprovacaoPc) => {
            return deleteMotivoReprovacaoPc(uuidMotivoReprovacaoPc);
        },
        onSuccess: () => {
            // Refaz a lista de motivos de PC reprovada
            queryClient.invalidateQueries(['motivos-reprovacao-pc']).then();
            // Mensagens
            handleCloseModalForm();
            toastCustom.ToastCustomSuccess('Motivo de reprovação de PC excluído', `O motivo de reprovação de PC foi excluído com sucesso.`);
        },
        onError: (error) => {
            if (error?.response?.data?.mensagem) {
                toastCustom.ToastCustomError('Erro ao apagar o motivo de reprovação de PC', error.response.data.mensagem)
            } else {
                toastCustom.ToastCustomError('Erro ao apagar o motivo de reprovação de PC', `Não foi possível apagar o motivo de reprovação de PC`)
            }
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
