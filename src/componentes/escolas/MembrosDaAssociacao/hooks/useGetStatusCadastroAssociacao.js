import {useQuery} from "@tanstack/react-query";
import {getStatusCadastroAssociacao} from "../../../../services/escolas/Associacao.service";

export const useGetStatusCadastroAssociacao = () => {

    const {
        isPending: isLoading_status_cadastro_associacao,
        isError: isError_status_cadastro_associacao,
        data: data_status_cadastro_associacao,
        error: error_status_cadastro_associacao } = useQuery({
        queryKey: ['status-cadastro-associacao'],
        queryFn: ()=> getStatusCadastroAssociacao(),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return {isLoading_status_cadastro_associacao, isError_status_cadastro_associacao, data_status_cadastro_associacao, error_status_cadastro_associacao}


}