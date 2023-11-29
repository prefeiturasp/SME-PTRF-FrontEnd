import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postCargoComposicao} from "../../../../services/Mandatos.service";
import {toastCustom} from "../../../Globais/ToastCustom";

// Preparação para react-router-dom-v6
import {useNavigate} from "react-router-dom-v5-compat";

export const usePostCargoDaComposicao = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate();

    const mutationPostCargoDaComposicao = useMutation({
        mutationFn: ({payload}) => {
            return postCargoComposicao(payload)
        },
        onSuccess: (data) => {
            console.log("Cargo Composição criado com sucesso ", data)
            // Refaz a lista de cargos-da-composicao
            queryClient.invalidateQueries(['cargos-da-composicao']).then()
            toastCustom.ToastCustomSuccess('Membro incluído com sucesso', `O membro foi adicionado ao sistema com sucesso.`)
            navigate("/membros-da-associacao");
        },
        onError: (error) => {
            console.log("Erro ao criar Cargo da Composição ", error.response)
            let msg_erro = ""
            if (error.response.data.non_field_errors && error.response.data.non_field_errors.length > 0){
                error.response.data.non_field_errors.map((msg)=>
                    msg_erro += msg
                )
            }else {
                msg_erro = error.response.data.detail
            }
            toastCustom.ToastCustomError('Erro ao criar Cargo da Composição', `${msg_erro}`)
        },
        onSettled: () => {
        },
    })
    return {mutationPostCargoDaComposicao}
}