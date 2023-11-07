import {useContext} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useHistory} from "react-router-dom";
import { postIncluirUnidade } from "../../../../services/GestaoDeUsuarios.service";
import { GestaoDeUsuariosAdicionarUnidadeContext } from "../context/GestaoUsuariosAdicionarUnidadeProvider";
import {toastCustom} from "../../../Globais/ToastCustom";

export const useIncluirUnidade = () => {
    const queryClient = useQueryClient();
    const history = useHistory();
    const { currentPage } = useContext(GestaoDeUsuariosAdicionarUnidadeContext)
    
    const mutationIncluirUnidade = useMutation({
        mutationFn: ({payload}) => {
            return postIncluirUnidade(payload)
        },
        onSuccess: (response) => {
            console.log("Acesso habilitado com sucesso ", response)
            // Refaz a lista
            queryClient.invalidateQueries(['unidades-disponiveis-inclusao', currentPage]).then()
            toastCustom.ToastCustomSuccess(`${response.data}`, ``);
            history.goBack()
        },
        onError: (error) => {
            console.log("Erro ao habilitar acesso ", error.response)
            toastCustom.ToastCustomError('Erro ao habilitar acesso');
        },
    })
    return {mutationIncluirUnidade}
}