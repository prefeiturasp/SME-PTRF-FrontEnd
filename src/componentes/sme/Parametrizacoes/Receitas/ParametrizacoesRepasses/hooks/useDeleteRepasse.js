import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import { useContext } from "react";
import { RepassesContext } from "../context/Repasse";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const useDeleteRepasse = () => {

    const queryClient = useQueryClient();
    const { setShowModalForm, setBloquearBtnSalvarForm } = useContext(RepassesContext);

    const mutationDelete = useMutation({
        mutationFn: (uuid_repasse) => {
            return deleteRepasse(uuid_repasse);
        },
        onSuccess: () => {
            console.log("Repasse apagado com sucesso.");
            queryClient.invalidateQueries(['repasses-list']).then();
            // Mensagens
            setShowModalForm(false);
            toastCustom.ToastCustomSuccess('Exclusão do repasse realizada com sucesso', `O repasse foi excluído com sucesso.`);
        },
        onError: (error) => {
            let data = error.response?.data
            let mensagem = data?.mensagem ? data.mensagem : 'Não foi possível apagar o repasse'
            toastCustom.ToastCustomError('Erro ao apagar o repasse', mensagem)
            console.log("Erro ao apagar o repasse", error.response);
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
