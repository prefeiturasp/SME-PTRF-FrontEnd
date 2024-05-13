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
            toastCustom.ToastCustomError('Erro ao apagar o repasse', `Não foi possível apagar o repasse`)
            console.log("Erro ao apagar o repasse", error.response);
        },
        onSettled: () => {
            setBloquearBtnSalvarForm(false);
        },
    });

    return { mutationDelete };
}
