import {getComposicao} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";
import {useContext} from "react";
import {MembrosDaAssociacaoContext} from "../context/MembrosDaAssociacao";

export const useGetComposicao = (composicao_uuid='') => {

    let {composicaoUuid} = useContext(MembrosDaAssociacaoContext)

    if (composicao_uuid){
        composicaoUuid = composicao_uuid
    }

    const { status, isError, data, error } = useQuery({
        queryKey: ['retrieve-composicao', composicaoUuid],
        queryFn: ()=> getComposicao(composicaoUuid),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return {isLoading: status === 'loading', isError, data, error}


}