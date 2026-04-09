import { useMutation } from "@tanstack/react-query";
import { postIniciarRetificacaoPaa } from "../../../../../services/escolas/Paa.service";


export const usePostIniciarRetificacaoPaa = () => {
    const mutationPost = useMutation({
        mutationFn: ({paaUuid, payload}) => {
            return postIniciarRetificacaoPaa(paaUuid, payload)
        },
    })
    return {mutationPost}
}